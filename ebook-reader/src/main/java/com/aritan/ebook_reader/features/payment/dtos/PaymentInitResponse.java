package com.aritan.ebook_reader.features.payment.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInitResponse {
    private Long paymentId;
    private String paymentUrl;
}
