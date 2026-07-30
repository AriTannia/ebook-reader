package com.aritan.ebook_reader.config.payment.gateway;

import com.aritan.ebook_reader.common.constants.messages.payment.PaymentMessage;
import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.config.payment.gateway.dtos.Momo.MomoCreatePaymentRequest;
import com.aritan.ebook_reader.config.payment.gateway.dtos.Momo.MomoCreatePaymentResponse;
import com.aritan.ebook_reader.config.payment.gateway.dtos.Momo.MomoIpnRequest;
import com.aritan.ebook_reader.config.payment.gateway.dtos.PaymentVerifyResult;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Profile("!mock-payment")
public class MomoPaymentGatewayImpl implements PaymentGateway{
    @Value("${momo.partnerCode}")
    private String momoPartnerCode;

    @Value("${momo.accessKey}")
    private String momoAccessKey;

    @Value("${momo.secretKey}")
    private String momoSecretKey;

    @Value("${momo.payUrl}")
    private String momoPayUrl;

    @Value("${momo.redirectUrl}")
    private String momoRedirectUrl;

    @Value("${momo.ipnUrl}")
    private String momoIpnUrl;

    @Value("${momo.requestType}")
    private String momoRequestType;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.MOMO;
    }

    @Override
    public String createPaymentUrl(Payment payment, HttpServletRequest request) {
        String requestId = UUID.randomUUID().toString();
        String orderId = payment.getProviderTxnRef();
        String amount = payment.getAmount()
                .setScale(0, java.math.RoundingMode.HALF_UP)
                .toPlainString();
        String orderInfo = "Payment for order " + payment.getOrder().getOrderId();
        String extraData = "";

        String rawSignature = "accessKey=" + momoAccessKey
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&ipnUrl=" + momoIpnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + momoPartnerCode
                + "&redirectUrl=" + momoRedirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + momoRequestType;

        String signature = hmacSHA256(momoSecretKey, rawSignature);

        MomoCreatePaymentRequest requestBody = MomoCreatePaymentRequest.builder()
                .partnerCode(momoPartnerCode)
                .requestId(requestId)
                .amount(amount)
                .orderId(orderId)
                .orderInfo(orderInfo)
                .redirectUrl(momoRedirectUrl)
                .ipnUrl(momoIpnUrl)
                .requestType(momoRequestType)
                .extraData(extraData)
                .signature(signature)
                .lang("en")
                .build();

        try {
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(momoPayUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            MomoCreatePaymentResponse response = objectMapper.readValue(httpResponse.body(), MomoCreatePaymentResponse.class);

            if (response.getResultCode() != 0) {
                throw new RuntimeException(PaymentMessage.PAYMENT_MOMO_INITIATED_FAILED + ": " + response.getMessage());
            }
            return response.getPayUrl();

        } catch (Exception e) {
            throw new RuntimeException(PaymentMessage.ERROR_CALL_PAYMENT_GATEWAY, e);
        }
    }

    @Override
    public PaymentVerifyResult verifyCallback(Map<String, String> params) {
        MomoIpnRequest ipn = objectMapper.convertValue(params, MomoIpnRequest.class);
        String rawSignature = "accessKey=" + momoAccessKey
                + "&amount=" + ipn.getAmount()
                + "&extraData=" + ipn.getExtraData()
                + "&message=" + ipn.getMessage()
                + "&orderId=" + ipn.getOrderId()
                + "&orderInfo=" + ipn.getOrderInfo()
                + "&orderType=" + ipn.getOrderType()
                + "&partnerCode=" + ipn.getPartnerCode()
                + "&payType=" + ipn.getPayType()
                + "&requestId=" + ipn.getRequestId()
                + "&responseTime=" + ipn.getResponseTime()
                + "&resultCode=" + ipn.getResultCode()
                + "&transId=" + ipn.getTransId();

        boolean valid = hmacSHA256(momoSecretKey, rawSignature).equalsIgnoreCase(ipn.getSignature());
        boolean success = valid && ipn.getResultCode() == 0;

        return PaymentVerifyResult.builder()
                .valid(valid)
                .success(success)
                .providerTxnRef(ipn.getOrderId())
                .providerTransactionId(String.valueOf(ipn.getTransId()))
                .responseCode(String.valueOf(ipn.getResultCode()))
                .rawResponseJson(objectMapper.writeValueAsString(ipn))
                .build();
    }

    private String hmacSHA256(String key, String data) {
        try {
            Mac hmac256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac256.init(secretKeySpec);
            byte[] result = hmac256.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException(PaymentMessage.ERROR_GENERATE_HMAC, e);
        }
    }
}
