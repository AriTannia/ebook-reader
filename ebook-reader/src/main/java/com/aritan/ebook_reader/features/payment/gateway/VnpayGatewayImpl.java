package com.aritan.ebook_reader.features.payment.gateway;

import com.aritan.ebook_reader.common.enums.payment.PaymentProvider;
import com.aritan.ebook_reader.common.models.payment.Payment;
import com.aritan.ebook_reader.features.payment.dtos.PaymentVerifyResult;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class VnpayGatewayImpl implements PaymentGateway {

    @Value("${vnpay.tmnCode}")
    private String vnpTmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnpHashSecret;

    @Value("${vnpay.payUrl}")
    private String vnpPayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnpReturnUrl;

    private final ObjectMapper objectMapper;
    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.VNPAY;
    }

    @Override
    public String createPaymentUrl(Payment payment, HttpServletRequest request) {
        Map<String, String> params = new TreeMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpTmnCode);
        params.put("vnp_Amount", payment.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP).toString());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", payment.getProviderTxnRef());
        params.put("vnp_OrderInfo", "Payment for order " + payment.getOrder().getOrderId());
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpReturnUrl);
        params.put("vnp_IpAddr", getClientIp(request));
        params.put("vnp_CreateDate", LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        params.put("vnp_ExpireDate", LocalDateTime.now()
                .plusMinutes(15)
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        String secureHash = buildSecureHash(params);

        StringBuilder query = new StringBuilder();
        try {
            for(Map.Entry<String, String> entry : params.entrySet()) {
                query.append(entry.getKey())
                     .append("=")
                     .append(java.net.URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                     .append("&");
            }
            query.append("vnp_SecureHash=").append(secureHash);
        } catch (Exception e){
            throw new RuntimeException("Failed to build VNPay payment URL", e);
        }

        return vnpPayUrl + "?" + query;
    }

    @Override
    public PaymentVerifyResult verifyCallback(Map<String, String> params) {
        Map<String, String> fields = new TreeMap<>(params);

        String receivedHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String calculatedHash = buildSecureHash(fields);
        boolean valid = calculatedHash.equalsIgnoreCase(receivedHash);

        String responseCode = params.get("vnp_ResponseCode");
        boolean success = valid && "00".equals(responseCode);

        return PaymentVerifyResult.builder()
                .valid(valid)
                .success(success)
                .providerTxnRef(params.get("vnp_TxnRef"))
                .providerTransactionId(params.get("vnp_TransactionNo"))
                .responseCode(responseCode)
                .rawResponseJson(toJson(params))
                .build();
    }

    private String buildSecureHash(Map<String, String> params) {
        StringBuilder signData = new StringBuilder();
        Iterator<Map.Entry<String, String>> it = params.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, String> entry = it.next();
            signData.append(entry.getKey()).append('=').append(entry.getValue());
            if (it.hasNext()) signData.append('&');
        }
        return hmacSHA512(vnpHashSecret, signData.toString());
    }

    private String hmacSHA512(String key, String data){
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKeySpec);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result){
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error while generating HMAC SHA512", e);
        }
    }

    private String getClientIp(HttpServletRequest request){
        String ip = request.getHeader("X-Forwarded-For");
        return (ip != null && !ip.isBlank()) ? ip.split(",")[0] : request.getRemoteAddr();
    }

    private String toJson(Map<String, String> params) {
        try {
            return objectMapper.writeValueAsString(params);
        } catch (Exception e) {
            return "{}";
        }
    }
}
