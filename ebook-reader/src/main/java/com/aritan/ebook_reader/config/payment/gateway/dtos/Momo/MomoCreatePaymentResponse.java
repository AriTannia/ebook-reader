package com.aritan.ebook_reader.config.payment.gateway.dtos.Momo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MomoCreatePaymentResponse {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private Long amount;
    private String message;
    private Integer resultCode;
    private String payUrl;
}
