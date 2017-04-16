package com.uzapp.dominio;

public class Mail {

    private String mensaje;
    private String destinatario;

    public Mail() {}

    public Mail(String mensaje, String destinatario){
        this.mensaje = mensaje;
        this.destinatario = destinatario;
    }

    public String getMensaje() { return this.mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public String getDestinatario() { return this.destinatario; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }
}
