package com.aritan.ebook_reader.config.payment.gateway.dtos.Momo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoCreatePaymentRequest {
    private String partnerCode;
    private String requestId;
    private String amount;
    private String orderId;
    private String orderInfo;
    private String redirectUrl;
    private String ipnUrl;
    private String requestType;
    private String extraData;
    private String lang;
    private String signature;
}
