package com.uzapp.dominio;

import java.sql.Date;

public class Cambio {

	private int id_cambio;
	private String descripcion;
	private Date fecha;
	private String id_usuario;
	private String id_admin_validador;
	private boolean validado;
	private String foto;
	private String id_espacio;
	private String id_edificio;
	private String id_utc;
	private String id_centro;
	private String id_cc;
	private int id_sorolla;
	private int tipo_de_uso;
	private int largo;
	private int ancho;
	private int diagonal;
	private int superficie;
	private int altura_maxima;
	private int altura_media;
	private int volumen;
	private boolean falso_techo;
	private int nmro_ventanas;
	private int persianas_ext;
	private int orientacion_pral;
	private int iluminacion_art;
	private int nmro_puntos_luz;
	private int nmro_puntos_agua;
	private int nmro_puntos_gas;
	private boolean vitrinas_riesgo_biologico;
	private boolean vitrinas_riesgo_quimico;
	private int nmro_vitrinas_rb;
	private int nmro_vitrinas_rq;
	private boolean ptos_extraccion_localizada;
	private int nmro_ptos_ext_localiz;
	private int tipo_calefaccion;
	private int tipo_climatizacion;
	private String rosetas_voz;
	private String rosetas_datos;
	private int canon_fijo;
	private int pantalla_proyector;
	private int equipo_de_sonido;
	private int tv;
	private int video;
	private int dvd;
	private int fotocopiadoras;
	private int impresoras;
	private int ordenadores;
	private int faxes;
	private int telefonos;
	private int pizarra;
	private int nmro_plazas;
	private String cad_asociado;
	private String observaciones;
	private boolean extintores_de_polvo;
	private boolean extintores_de_co2;
	private int nmro_extintores_polvo;
	private int nmro_extintores_co2;
	private boolean bies;
	private int nmro_bies;
	private int tipo_bies;
	private boolean columna_seca;
	private boolean grupo_de_presion_incendios;
	private boolean deteccion_incendios;
	private boolean proteccion_por_rociadores;
	private boolean iluminacion_de_emergencia;
	private int potencia_electrica_instaladaw;
	private boolean reservable;

	public Cambio(int id_cambio, String descripcion, Date fecha, String id_usuario, String id_admin_validador,
			boolean validado, String foto, String id_espacio, String id_edificio, String id_utc, String id_centro,
			String id_cc, int id_sorolla, int tipo_de_uso, int largo, int ancho, int diagonal, int superficie,
			int altura_maxima, int altura_media, int volumen, boolean falso_techo, int nmro_ventanas, int persianas_ext,
			int orientacion_pral, int iluminacion_art, int nmro_puntos_luz, int nmro_puntos_agua, int nmro_puntos_gas,
			boolean vitrinas_riesgo_biologico, boolean vitrinas_riesgo_quimico, int nmro_vitrinas_rb,
			int nmro_vitrinas_rq, boolean ptos_extraccion_localizada, int nmro_ptos_ext_localiz, int tipo_calefaccion,
			int tipo_climatizacion, String rosetas_voz, String rosetas_datos, int canon_fijo, int pantalla_proyector,
			int equipo_de_sonido, int tv, int video, int dvd, int fotocopiadoras, int impresoras, int ordenadores,
			int faxes, int telefonos, int pizarra, int nmro_plazas, String cad_asociado, String observaciones,
			boolean extintores_de_polvo, boolean extintores_de_co2, int nmro_extintores_polvo, int nmro_extintores_co2,
			boolean bies, int nmro_bies, int tipo_bies, boolean columna_seca, boolean grupo_de_presion_incendios,
			boolean deteccion_incendios, boolean proteccion_por_rociadores, boolean iluminacion_de_emergencia,
			int potencia_electrica_instaladaw, boolean reservable) {
		this.id_cambio = id_cambio;
		this.descripcion = descripcion;
		this.fecha = fecha;
		this.id_usuario = id_usuario;
		this.id_admin_validador = id_admin_validador;
		this.validado = validado;
		this.foto = foto;
		this.id_espacio = id_espacio;
		this.id_edificio = id_edificio;
		this.id_utc = id_utc;
		this.id_centro = id_centro;
		this.id_cc = id_cc;
		this.id_sorolla = id_sorolla;
		this.tipo_de_uso = tipo_de_uso;
		this.largo = largo;
		this.ancho = ancho;
		this.diagonal = diagonal;
		this.superficie = superficie;
		this.altura_maxima = altura_maxima;
		this.altura_media = altura_media;
		this.volumen = volumen;
		this.falso_techo = falso_techo;
		this.nmro_ventanas = nmro_ventanas;
		this.persianas_ext = persianas_ext;
		this.orientacion_pral = orientacion_pral;
		this.iluminacion_art = iluminacion_art;
		this.nmro_puntos_luz = nmro_puntos_luz;
		this.nmro_puntos_agua = nmro_puntos_agua;
		this.nmro_puntos_gas = nmro_puntos_gas;
		this.vitrinas_riesgo_biologico = vitrinas_riesgo_biologico;
		this.vitrinas_riesgo_quimico = vitrinas_riesgo_quimico;
		this.nmro_vitrinas_rb = nmro_vitrinas_rb;
		this.nmro_vitrinas_rq = nmro_vitrinas_rq;
		this.ptos_extraccion_localizada = ptos_extraccion_localizada;
		this.nmro_ptos_ext_localiz = nmro_ptos_ext_localiz;
		this.tipo_calefaccion = tipo_calefaccion;
		this.tipo_climatizacion = tipo_climatizacion;
		this.rosetas_voz = rosetas_voz;
		this.rosetas_datos = rosetas_datos;
		this.canon_fijo = canon_fijo;
		this.pantalla_proyector = pantalla_proyector;
		this.equipo_de_sonido = equipo_de_sonido;
		this.tv = tv;
		this.video = video;
		this.dvd = dvd;
		this.fotocopiadoras = fotocopiadoras;
		this.impresoras = impresoras;
		this.ordenadores = ordenadores;
		this.faxes = faxes;
		this.telefonos = telefonos;
		this.pizarra = pizarra;
		this.nmro_plazas = nmro_plazas;
		this.cad_asociado = cad_asociado;
		this.observaciones = observaciones;
		this.extintores_de_polvo = extintores_de_polvo;
		this.extintores_de_co2 = extintores_de_co2;
		this.nmro_extintores_polvo = nmro_extintores_polvo;
		this.nmro_extintores_co2 = nmro_extintores_co2;
		this.bies = bies;
		this.nmro_bies = nmro_bies;
		this.tipo_bies = tipo_bies;
		this.columna_seca = columna_seca;
		this.grupo_de_presion_incendios = grupo_de_presion_incendios;
		this.deteccion_incendios = deteccion_incendios;
		this.proteccion_por_rociadores = proteccion_por_rociadores;
		this.iluminacion_de_emergencia = iluminacion_de_emergencia;
		this.potencia_electrica_instaladaw = potencia_electrica_instaladaw;
		this.reservable = reservable;
	}

	public int getId_cambio() {
		return id_cambio;
	}

	public void setId_cambio(int id_cambio) {
		this.id_cambio = id_cambio;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Date getFecha() {
		return fecha;
	}

	public void setFecha(Date fecha) {
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

	public boolean isValidado() {
		return validado;
	}

	public void setValidado(boolean validado) {
		this.validado = validado;
	}

	public String getFoto() {
		return foto;
	}

	public void setFoto(String foto) {
		this.foto = foto;
	}

	public String getId_espacio() {
		return id_espacio;
	}

	public void setId_espacio(String id_espacio) {
		this.id_espacio = id_espacio;
	}

	public String getId_edificio() {
		return id_edificio;
	}

	public void setId_edificio(String id_edificio) {
		this.id_edificio = id_edificio;
	}

	public String getId_utc() {
		return id_utc;
	}

	public void setId_utc(String id_utc) {
		this.id_utc = id_utc;
	}

	public String getId_centro() {
		return id_centro;
	}

	public void setId_centro(String id_centro) {
		this.id_centro = id_centro;
	}

	public String getId_cc() {
		return id_cc;
	}

	public void setId_cc(String id_cc) {
		this.id_cc = id_cc;
	}

	public int getId_sorolla() {
		return id_sorolla;
	}

	public void setId_sorolla(int id_sorolla) {
		this.id_sorolla = id_sorolla;
	}

	public int getTipo_de_uso() {
		return tipo_de_uso;
	}

	public void setTipo_de_uso(int tipo_de_uso) {
		this.tipo_de_uso = tipo_de_uso;
	}

	public int getLargo() {
		return largo;
	}

	public void setLargo(int largo) {
		this.largo = largo;
	}

	public int getAncho() {
		return ancho;
	}

	public void setAncho(int ancho) {
		this.ancho = ancho;
	}

	public int getDiagonal() {
		return diagonal;
	}

	public void setDiagonal(int diagonal) {
		this.diagonal = diagonal;
	}

	public int getSuperficie() {
		return superficie;
	}

	public void setSuperficie(int superficie) {
		this.superficie = superficie;
	}

	public int getAltura_maxima() {
		return altura_maxima;
	}

	public void setAltura_maxima(int altura_maxima) {
		this.altura_maxima = altura_maxima;
	}

	public int getAltura_media() {
		return altura_media;
	}

	public void setAltura_media(int altura_media) {
		this.altura_media = altura_media;
	}

	public int getVolumen() {
		return volumen;
	}

	public void setVolumen(int volumen) {
		this.volumen = volumen;
	}

	public boolean isFalso_techo() {
		return falso_techo;
	}

	public void setFalso_techo(boolean falso_techo) {
		this.falso_techo = falso_techo;
	}

	public int getNmro_ventanas() {
		return nmro_ventanas;
	}

	public void setNmro_ventanas(int nmro_ventanas) {
		this.nmro_ventanas = nmro_ventanas;
	}

	public int getPersianas_ext() {
		return persianas_ext;
	}

	public void setPersianas_ext(int persianas_ext) {
		this.persianas_ext = persianas_ext;
	}

	public int getOrientacion_pral() {
		return orientacion_pral;
	}

	public void setOrientacion_pral(int orientacion_pral) {
		this.orientacion_pral = orientacion_pral;
	}

	public int getIluminacion_art() {
		return iluminacion_art;
	}

	public void setIluminacion_art(int iluminacion_art) {
		this.iluminacion_art = iluminacion_art;
	}

	public int getNmro_puntos_luz() {
		return nmro_puntos_luz;
	}

	public void setNmro_puntos_luz(int nmro_puntos_luz) {
		this.nmro_puntos_luz = nmro_puntos_luz;
	}

	public int getNmro_puntos_agua() {
		return nmro_puntos_agua;
	}

	public void setNmro_puntos_agua(int nmro_puntos_agua) {
		this.nmro_puntos_agua = nmro_puntos_agua;
	}

	public int getNmro_puntos_gas() {
		return nmro_puntos_gas;
	}

	public void setNmro_puntos_gas(int nmro_puntos_gas) {
		this.nmro_puntos_gas = nmro_puntos_gas;
	}

	public boolean isVitrinas_riesgo_biologico() {
		return vitrinas_riesgo_biologico;
	}

	public void setVitrinas_riesgo_biologico(boolean vitrinas_riesgo_biologico) {
		this.vitrinas_riesgo_biologico = vitrinas_riesgo_biologico;
	}

	public boolean isVitrinas_riesgo_quimico() {
		return vitrinas_riesgo_quimico;
	}

	public void setVitrinas_riesgo_quimico(boolean vitrinas_riesgo_quimico) {
		this.vitrinas_riesgo_quimico = vitrinas_riesgo_quimico;
	}

	public int getNmro_vitrinas_rb() {
		return nmro_vitrinas_rb;
	}

	public void setNmro_vitrinas_rb(int nmro_vitrinas_rb) {
		this.nmro_vitrinas_rb = nmro_vitrinas_rb;
	}

	public int getNmro_vitrinas_rq() {
		return nmro_vitrinas_rq;
	}

	public void setNmro_vitrinas_rq(int nmro_vitrinas_rq) {
		this.nmro_vitrinas_rq = nmro_vitrinas_rq;
	}

	public boolean isPtos_extraccion_localizada() {
		return ptos_extraccion_localizada;
	}

	public void setPtos_extraccion_localizada(boolean ptos_extraccion_localizada) {
		this.ptos_extraccion_localizada = ptos_extraccion_localizada;
	}

	public int getNmro_ptos_ext_localiz() {
		return nmro_ptos_ext_localiz;
	}

	public void setNmro_ptos_ext_localiz(int nmro_ptos_ext_localiz) {
		this.nmro_ptos_ext_localiz = nmro_ptos_ext_localiz;
	}

	public int getTipo_calefaccion() {
		return tipo_calefaccion;
	}

	public void setTipo_calefaccion(int tipo_calefaccion) {
		this.tipo_calefaccion = tipo_calefaccion;
	}

	public int getTipo_climatizacion() {
		return tipo_climatizacion;
	}

	public void setTipo_climatizacion(int tipo_climatizacion) {
		this.tipo_climatizacion = tipo_climatizacion;
	}

	public String getRosetas_voz() {
		return rosetas_voz;
	}

	public void setRosetas_voz(String rosetas_voz) {
		this.rosetas_voz = rosetas_voz;
	}

	public String getRosetas_datos() {
		return rosetas_datos;
	}

	public void setRosetas_datos(String rosetas_datos) {
		this.rosetas_datos = rosetas_datos;
	}

	public int getCanon_fijo() {
		return canon_fijo;
	}

	public void setCanon_fijo(int canon_fijo) {
		this.canon_fijo = canon_fijo;
	}

	public int getPantalla_proyector() {
		return pantalla_proyector;
	}

	public void setPantalla_proyector(int pantalla_proyector) {
		this.pantalla_proyector = pantalla_proyector;
	}

	public int getEquipo_de_sonido() {
		return equipo_de_sonido;
	}

	public void setEquipo_de_sonido(int equipo_de_sonido) {
		this.equipo_de_sonido = equipo_de_sonido;
	}

	public int getTv() {
		return tv;
	}

	public void setTv(int tv) {
		this.tv = tv;
	}

	public int getVideo() {
		return video;
	}

	public void setVideo(int video) {
		this.video = video;
	}

	public int getDvd() {
		return dvd;
	}

	public void setDvd(int dvd) {
		this.dvd = dvd;
	}

	public int getFotocopiadoras() {
		return fotocopiadoras;
	}

	public void setFotocopiadoras(int fotocopiadoras) {
		this.fotocopiadoras = fotocopiadoras;
	}

	public int getImpresoras() {
		return impresoras;
	}

	public void setImpresoras(int impresoras) {
		this.impresoras = impresoras;
	}

	public int getOrdenadores() {
		return ordenadores;
	}

	public void setOrdenadores(int ordenadores) {
		this.ordenadores = ordenadores;
	}

	public int getFaxes() {
		return faxes;
	}

	public void setFaxes(int faxes) {
		this.faxes = faxes;
	}

	public int getTelefonos() {
		return telefonos;
	}

	public void setTelefonos(int telefonos) {
		this.telefonos = telefonos;
	}

	public int getPizarra() {
		return pizarra;
	}

	public void setPizarra(int pizarra) {
		this.pizarra = pizarra;
	}

	public int getNmro_plazas() {
		return nmro_plazas;
	}

	public void setNmro_plazas(int nmro_plazas) {
		this.nmro_plazas = nmro_plazas;
	}

	public String getCad_asociado() {
		return cad_asociado;
	}

	public void setCad_asociado(String cad_asociado) {
		this.cad_asociado = cad_asociado;
	}

	public String getObservaciones() {
		return observaciones;
	}

	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}

	public boolean isExtintores_de_polvo() {
		return extintores_de_polvo;
	}

	public void setExtintores_de_polvo(boolean extintores_de_polvo) {
		this.extintores_de_polvo = extintores_de_polvo;
	}

	public boolean isExtintores_de_co2() {
		return extintores_de_co2;
	}

	public void setExtintores_de_co2(boolean extintores_de_co2) {
		this.extintores_de_co2 = extintores_de_co2;
	}

	public int getNmro_extintores_polvo() {
		return nmro_extintores_polvo;
	}

	public void setNmro_extintores_polvo(int nmro_extintores_polvo) {
		this.nmro_extintores_polvo = nmro_extintores_polvo;
	}

	public int getNmro_extintores_co2() {
		return nmro_extintores_co2;
	}

	public void setNmro_extintores_co2(int nmro_extintores_co2) {
		this.nmro_extintores_co2 = nmro_extintores_co2;
	}

	public boolean isBies() {
		return bies;
	}

	public void setBies(boolean bies) {
		this.bies = bies;
	}

	public int getNmro_bies() {
		return nmro_bies;
	}

	public void setNmro_bies(int nmro_bies) {
		this.nmro_bies = nmro_bies;
	}

	public int getTipo_bies() {
		return tipo_bies;
	}

	public void setTipo_bies(int tipo_bies) {
		this.tipo_bies = tipo_bies;
	}

	public boolean isColumna_seca() {
		return columna_seca;
	}

	public void setColumna_seca(boolean columna_seca) {
		this.columna_seca = columna_seca;
	}

	public boolean isGrupo_de_presion_incendios() {
		return grupo_de_presion_incendios;
	}

	public void setGrupo_de_presion_incendios(boolean grupo_de_presion_incendios) {
		this.grupo_de_presion_incendios = grupo_de_presion_incendios;
	}

	public boolean isDeteccion_incendios() {
		return deteccion_incendios;
	}

	public void setDeteccion_incendios(boolean deteccion_incendios) {
		this.deteccion_incendios = deteccion_incendios;
	}

	public boolean isProteccion_por_rociadores() {
		return proteccion_por_rociadores;
	}

	public void setProteccion_por_rociadores(boolean proteccion_por_rociadores) {
		this.proteccion_por_rociadores = proteccion_por_rociadores;
	}

	public boolean isIluminacion_de_emergencia() {
		return iluminacion_de_emergencia;
	}

	public void setIluminacion_de_emergencia(boolean iluminacion_de_emergencia) {
		this.iluminacion_de_emergencia = iluminacion_de_emergencia;
	}

	public int getPotencia_electrica_instaladaw() {
		return potencia_electrica_instaladaw;
	}

	public void setPotencia_electrica_instaladaw(int potencia_electrica_instaladaw) {
		this.potencia_electrica_instaladaw = potencia_electrica_instaladaw;
	}

	public boolean isReservable() {
		return reservable;
	}

	public void setReservable(boolean reservable) {
		this.reservable = reservable;
	}
}
