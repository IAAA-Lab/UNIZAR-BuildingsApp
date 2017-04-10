package com.uzapp.dominio;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Notificacion {

	private int id_notificacion;
	private int tipo_notificacion;
	private String id_espacio;
	private String descripcion;
	private LocalDateTime fecha;
	private String id_usuario;
	private String id_admin_validador;
	private String estado;
	private String foto;
	private String email_usuario;
	private String comentario_admin;

	private String ciudad;
	private String campus;
	private String edificio;
	private String planta;
	private String espacio;
	private String direccion;

	public Notificacion() {}

	@JsonCreator
	public Notificacion(@JsonProperty("id_espacio") String id_espacio,
											@JsonProperty("descripcion") String descripcion,
											@JsonProperty("id_usuario") String id_usuario,
											@JsonProperty("estado") String estado,
											@JsonProperty("foto") String foto,
											@JsonProperty("email_usuario") String email_usuario) {

		this.id_espacio = id_espacio;
		this.descripcion = descripcion;
		this.id_usuario = id_usuario;
		this.estado = estado;
		this.foto = foto;
		this.email_usuario = email_usuario;
	}

	// public Notificacion(String id_espacio, String descripcion,
	// String id_usuario, String estado, String email_usuario) {
	// 	this.id_espacio = id_espacio;
	// 	this.descripcion = descripcion;
	// 	this.id_usuario = id_usuario;
	// 	this.estado = estado;
	// 	this.email_usuario = email_usuario;
	// }
	//
	// public Notificacion(String id_espacio, String descripcion,
	// 		String estado, String foto, String email_usuario) {
	// 	this.id_espacio = id_espacio;
	// 	this.descripcion = descripcion;
	// 	this.estado = estado;
	// 	this.foto = foto;
	// 	this.email_usuario = email_usuario;
	// }
	//
	//
	// public Notificacion(String id_espacio, String descripcion,
	// 		int estado, String email_usuario) {
	// 	this.id_espacio = id_espacio;
	// 	this.descripcion = descripcion;
	// 	this.estado = estado;
	// 	this.email_usuario = email_usuario;
	// }
	//
	// public Notificacion(String id_espacio, String descripcion,
	// 		String foto, int estado) {
	// 	this.id_espacio = id_espacio;
	// 	this.descripcion = descripcion;
	// 	this.estado = estado;
	// 	this.foto = foto;
	// }
	//
	// public Notificacion(String id_espacio, String descripcion,
	// 		int estado) {
	// 	this.id_espacio = id_espacio;
	// 	this.descripcion = descripcion;
	// 	this.estado = estado;
	// }

	public int getId_notificacion() {
		return id_notificacion;
	}
	public void setId_notificacion(int id_notificacion) {
		this.id_notificacion = id_notificacion;
	}
	public int getTipo_notificacion() {
		return tipo_notificacion;
	}
	public void setTipo_notificacion(int tipo_notificacion) {
		this.tipo_notificacion = tipo_notificacion;
	}
	public String getId_espacio() {
		return id_espacio;
	}
	public void setId_espacio(String id_espacio) {
		this.id_espacio = id_espacio;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public LocalDateTime getFecha() {
		return fecha;
	}
	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}
	public String getId_usuario() {
		return id_usuario;
	}
	public void setId_usuario(String id_usuario) {
		this.id_usuario = id_usuario;
	}
	public String getId_admin_validador() {
		return id_admin_validador;
	}
	public void setId_admin_validador(String id_admin_validador) {
		this.id_admin_validador = id_admin_validador;
	}
	public String getEstado() {
		return estado;
	}
	public void setEstado(String estado) {
		this.estado = estado;
	}
	public String getFoto() {
		return foto;
	}
	public void setFoto(String foto) {
		this.foto = foto;
	}
	public String getCiudad() {
		return ciudad;
	}
	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}
	public String getCampus() {
		return campus;
	}
	public void setCampus(String campus) {
		this.campus = campus;
	}
	public String getEdificio() {
		return edificio;
	}
	public void setEdificio(String edificio) {
		this.edificio = edificio;
	}
	public String getPlanta() {
		return planta;
	}
	public void setPlanta(String planta) {
		this.planta = planta;
	}
	public String getEspacio() {
		return espacio;
	}
	public void setEspacio(String espacio) {
		this.espacio = espacio;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public String getEmail_usuario() {
		return email_usuario;
	}
	public void setEmail_usuario(String email_usuario) {
		this.email_usuario = email_usuario;
	}
	public String getComentario_admin() {
		return comentario_admin;
	}
	public void setComentario_admin(String comentario_admin) {
		this.comentario_admin = comentario_admin;
	}
}
