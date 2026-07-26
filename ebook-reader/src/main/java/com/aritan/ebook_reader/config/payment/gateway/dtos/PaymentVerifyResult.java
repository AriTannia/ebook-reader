package com.aritan.ebook_reader.config.payment.gateway.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerifyResult {
    private boolean valid;
    private boolean success;
    private String providerTxnRef;
    private String providerTransactionId;
    private String responseCode;
    private String rawResponseJson;
}
