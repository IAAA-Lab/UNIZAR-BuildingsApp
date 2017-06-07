package com.uzapp.controller;

import java.io.InputStream;
import java.io.IOException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.uzapp.dominio.Mail;

@CrossOrigin(origins = "*")
@RestController
public class MailController {

  private String username = "";
  private String password = "";

  @RequestMapping(
          value = "/mail",
          method = RequestMethod.POST)
  public void sendMail(@RequestBody Mail mail) {
   try {

      InputStream input = MailController.class.getClassLoader()
      .getResourceAsStream("config.properties");
      Properties prop = new Properties();
      prop.load(input);
      username = prop.getProperty("mail.user");
      password = prop.getProperty("mail.pass");

      Session session = Session.getInstance(prop,
      new javax.mail.Authenticator() {
        protected PasswordAuthentication getPasswordAuthentication() {
          return new PasswordAuthentication(username, password);
        }
      });

    	Message message = new MimeMessage(session);
    	message.setFrom(new InternetAddress(username));
    	message.setRecipients(Message.RecipientType.TO,
    		InternetAddress.parse(mail.getDestinatario()));
    	message.setSubject("Tu incidencia ha sido resuelta");
    	message.setText(mail.getMensaje());

    	Transport.send(message);

    	System.out.println("Done");

    }catch (IOException e) {
    	throw new RuntimeException(e);
    }catch (MessagingException e) {
    	throw new RuntimeException(e);
    }
  }
}
