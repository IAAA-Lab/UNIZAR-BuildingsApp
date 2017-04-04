// package com.uzapp.controller;
//
// import java.sql.Date;
// import java.util.Calendar;
//
// import javax.servlet.http.HttpServletResponse;
//
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
//
// import com.uzapp.security.jwt.utils.JwtInfo;
// import com.uzapp.security.jwt.utils.JwtUtil;
//
// @CrossOrigin(origins = "*")
// @RestController
// @RequestMapping("/cambio")
// public class CambiosController {
//
//   /**
//   * API: Create a request to create a change notification
//   */
//   @RequestMapping(
//           value = "/",
//           method = RequestMethod.POST)
//   public ResponseEntity<?> create(@RequestBody(required=false) Cambio cambio)
//   {
//       logger.info("Service: create cambio");
//       Connection connection = null;
//       PreparedStatement preparedStmt = null;
//       try {
//
//           Calendar calendar = Calendar.getInstance();
//           Date actualDate = new Date(calendar.getTime().getTime());
//
//           Gson gson = new Gson();
//           connection = ConnectionManager.getConnection();
//
//           String query = "INSERT INTO tb_cambios(" +
//             "descripcion,fecha,id_usuario,id_admin_validador,validado,foto," +
//             "id_espacio,id_edificio,id_utc,id_centro,id_cc,id_sorolla," +
//             "tipo_de_uso,largo,ancho,diagonal,superficie,altura_maxima," +
//             "altura_media,volumen,falso_techo,nmro_ventanas,persianas_ext," +
//             "orientacion_pral,iluminacion_art,nmro_puntos_luz,nmro_puntos_agua," +
//             "nmro_puntos_gas,vitrinas_riesgo_biologico,vitrinas_riesgo_quimico," +
//             "nmro_vitrinas_rb,nmro_vitrinas_rq,ptos_extraccion_localizada," +
//             "nmro_ptos_ext_localiz,tipo_calefaccion,tipo_climatizacion," +
//             "rosetas_voz,rosetas_datos,canon_fijo,pantalla_proyector," +
//             "equipo_de_sonido,tv,video,dvd,fotocopiadoras,impresoras,ordenadores," +
//             "faxes,telefonos,pizarra,nmro_plazas,cad_asociado,observaciones," +
//             "extintores_de_polvo,extintores_de_co2,nmro_extintores_polvo," +
//             "nmro_extintores_co2,bies,nmro_bies,columna_seca," +
//             "grupo_de_presion_incendios,deteccion_incendios," +
//             "proteccion_por_rociadores,iluminacion_de_emergencia," +
//             "potencia_electrica_instaladaw,reservable" +
//             ")" +
//             "values (" +
//               "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
//               "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
//               "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
//               "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?" +
//             ")";
//           preparedStmt = connection.prepareStatement(query);
//
//           preparedStmt.setString(1, cambio.getDescripcion());
//           preparedStmt.setDate(2, actualDate);
//           preparedStmt.setString(3, cambio.getId_usuario());
//           preparedStmt.setString(4, cambio.getId_admin_validador());
//           preparedStmt.setBoolean(5, cambio.isValidado());
//           // preparedStmt.setInt(6, cambio.getFoto());
//           preparedStmt.setString(7, cambio.getId_espacio());
//           preparedStmt.setString(8, cambio.getId_edificio());
//           preparedStmt.setString(9, cambio.getId_utc());
//           preparedStmt.setString(10, cambio.getId_centro());
//           preparedStmt.setString(11, cambio.getId_cc());
//           preparedStmt.setInt(12, cambio.getId_sorolla());
//           preparedStmt.setInt(13, cambio.getTipo_de_uso());
//           preparedStmt.setInt(14, cambio.getLargo());
//           preparedStmt.setInt(15, cambio.getAncho());
//           preparedStmt.setInt(16, cambio.getDiagonal());
//           preparedStmt.setInt(17, cambio.getSuperficie());
//           preparedStmt.setInt(18, cambio.getAltura_maxima());
//           preparedStmt.setInt(19, cambio.getAltura_media());
//           preparedStmt.setInt(20, cambio.getVolumen());
//           preparedStmt.setBoolean(21, cambio.isFalso_techo());
//           preparedStmt.setInt(22, cambio.getNmro_ventanas());
//           preparedStmt.setInt(23, cambio.getPersianas_ext());
//           preparedStmt.setInt(24, cambio.getOrientacion_pral());
//           preparedStmt.setInt(25, cambio.getIluminacion_art());
//           preparedStmt.setInt(26, cambio.getNmro_puntos_luz());
//           preparedStmt.setInt(27, cambio.getNmro_puntos_agua());
//           preparedStmt.setInt(28, cambio.getNmro_puntos_gas());
//           preparedStmt.setBoolean(29, cambio.isVitrinas_riesgo_biologico());
//           preparedStmt.setBoolean(30, cambio.isVitrinas_riesgo_quimico());
//           preparedStmt.setInt(31, cambio.getNmro_vitrinas_rb());
//           preparedStmt.setInt(32, cambio.getNmro_vitrinas_rq());
//           preparedStmt.setBoolean(33, cambio.isPtos_extraccion_localizada());
//           preparedStmt.setInt(34, cambio.getNmro_ptos_ext_localiz());
//           preparedStmt.setInt(35, cambio.getTipo_calefaccion());
//           preparedStmt.setInt(36, cambio.getTipo_climatizacion());
//           preparedStmt.setString(37, cambio.getRosetas_voz());
//           preparedStmt.setString(38, cambio.getRosetas_datos());
//           preparedStmt.setInt(39, cambio.getCanon_fijo());
//           preparedStmt.setInt(40, cambio.getPantalla_proyector());
//           preparedStmt.setInt(41, cambio.getEquipo_de_sonido());
//           preparedStmt.setInt(42, cambio.getTv());
//           preparedStmt.setInt(43, cambio.getVideo());
//           preparedStmt.setInt(44, cambio.getDvd());
//           preparedStmt.setInt(45, cambio.getFotocopiadoras());
//           preparedStmt.setInt(46, cambio.getImpresoras());
//           preparedStmt.setInt(47, cambio.getOrdenadores());
//           preparedStmt.setInt(48, cambio.getFaxes());
//           preparedStmt.setInt(49, cambio.getTelefonos());
//           preparedStmt.setInt(50, cambio.getPizarra());
//           preparedStmt.setInt(51, cambio.getNmro_plazas());
//           preparedStmt.setString(52, cambio.getCad_asociado());
//           preparedStmt.setString(53, cambio.getObservaciones());
//           preparedStmt.setBoolean(54, cambio.isExtintores_de_polvo());
//           preparedStmt.setBoolean(55, cambio.isExtintores_de_co2());
//           preparedStmt.setInt(56, cambio.getNmro_extintores_polvo());
//           preparedStmt.setInt(57, cambio.getNmro_extintores_co2());
//           preparedStmt.setBoolean(58, cambio.isBies());
//           preparedStmt.setInt(59, cambio.getNmro_bies());
//           preparedStmt.setInt(60, cambio.getTipo_bies());
//           preparedStmt.setBoolean(61, cambio.isColumna_seca());
//           preparedStmt.setBoolean(62, cambio.isGrupo_de_presion_incendios());
//           preparedStmt.setBoolean(63, cambio.isDeteccion_incendios());
//           preparedStmt.setBoolean(64, cambio.isProteccion_por_rociadores());
//           preparedStmt.setBoolean(65, cambio.isIluminacion_de_emergencia());
//           preparedStmt.setInt(66, cambio.getPotencia_electrica_instaladaw());
//           preparedStmt.setBoolean(67, cambio.isReservable());
//           int rowsInserted =preparedStmt.executeUpdate();
//
//           if (rowsInserted > 0) {
//               return new ResponseEntity<>(gson.toJson(cambio), HttpStatus.OK);
//           }
//           else {
//               return new ResponseEntity<>("Error creating Cambio", HttpStatus.INTERNAL_SERVER_ERROR);
//           }
//       }
//       catch (SQLException e) {
//           e.printStackTrace();
//           return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//       }
//       finally {
//           try { if (preparedStmt != null) preparedStmt.close(); }
//           catch (Exception excep) { excep.printStackTrace(); }
//           try { if (connection != null) connection.close(); }
//           catch (Exception excep) { excep.printStackTrace(); }
//       }
//   }
//
//     @RequestMapping(value="/cambio",method="GET")
//     public void checkToken(
//     		@RequestHeader(value="Authorization", defaultValue="") String token,
//     		HttpServletResponse response) {
//
//     	JwtUtil jwt = new JwtUtil();
//     	if (token.length() == 0) {
//
//     		// There is no token
//     		response.setStatus(400);
//     	}
//     	else {
//
//         // Splits the string to get rid of 'Bearer ' prefix
//         if (token.startsWith("Bearer ")) {
//           token = token.split(" ")[1];
//         }
//
//         System.out.println("TOKEN: " + token);
//
//     		JwtInfo jwtInfo = jwt.parseToken(token);
//     		if (jwtInfo == null) {
//
//     			// Invalid token
//     			response.setStatus(401);
//     		}
//     		else {
//
//     			// Valid token
//     			response.setStatus(200);
//     		}
//
//     	}
//     }
// }
