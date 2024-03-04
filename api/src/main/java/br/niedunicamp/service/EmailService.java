package br.niedunicamp.service;

import javax.mail.MessagingException;

import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

@Service
public interface EmailService {

    void sendSimpleMessage(String to, String subject, String text) throws MailException;

    void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment)
            throws MailException, MessagingException;
}