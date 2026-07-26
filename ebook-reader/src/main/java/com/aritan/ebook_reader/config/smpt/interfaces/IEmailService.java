package com.aritan.ebook_reader.config.smpt.interfaces;

public interface IEmailService {
    void sendPasswordResetEmail(String toEmail, String resetToken);
}
