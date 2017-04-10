package com.uzapp.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Properties;

import com.google.gson.Gson;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.uzapp.rest.busquedas.Estancias;
import com.uzapp.bd.ConnectionManager;
import com.uzapp.dominio.Notificacion;
import com.uzapp.dominio.User;
import com.uzapp.security.jwt.utils.JwtInfo;
import com.uzapp.security.jwt.utils.JwtUtil;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/notificacion")
public class NotificacionController {

  private static final Logger logger =
    LoggerFactory.getLogger(NotificacionController.class);

  // Base photos path
	private static String photosPath = "";

	// Initalize photos base path var from config properties file
	static {
		try {
			InputStream input = NotificacionController.class.getClassLoader()
                                  .getResourceAsStream("config.properties");
			Properties prop = new Properties();
			prop.load(input);
			photosPath = prop.getProperty("photos_path");
		}
		catch (IOException e) {
			e.printStackTrace(System.err);
		}
	}

  /**
  * API: Create a request to create a change notification
  */
  @RequestMapping(
          value = "/cambio",
          method = RequestMethod.POST)
  public ResponseEntity<?> createCambio(
    @RequestBody(required=false) Notificacion notificacion)
  {
      logger.info("Service: create cambio");

      // El tipo 1 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 1;
      return createNotificacion(tipoNotificacion, notificacion);
  }

  /**
  * API: Create a request to update a change notification
  */
  @RequestMapping(
          value = "/cambio/{id_cambio}",
          method = RequestMethod.PUT)
  public ResponseEntity<?> updateCambio(
    @RequestBody(required=false) Notificacion notificacion,
    @PathVariable("id_cambio") int id_cambio)
  {
      logger.info("Service: update cambio");

      // El tipo 1 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 1;
      return updateNotificacion(tipoNotificacion, id_cambio, notificacion);
  }

  /**
  * API: Create a request to create a change notification
  */
  @RequestMapping(
          value = "/cambio/{id_cambio}",
          method = RequestMethod.GET)
  public ResponseEntity<?> getCambio(@PathVariable("id_cambio") int id_cambio)
  {
      logger.info("Service: get cambio by id");

      // El tipo 1 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 1;
      return getNotificacion(tipoNotificacion, id_cambio);
  }

  /**
  * API: Create a request to retrieve all change notifications
  */
  @RequestMapping(
          value = "/cambio",
          method = RequestMethod.GET)
  public ResponseEntity<?> getCambios()
  {
      logger.info("Service: get all cambios");

      // El tipo 1 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 1;
      return getNotificaciones(tipoNotificacion);
  }

  /**
  * API: Create a request to retrieve all change notifications of one user
  */
  @RequestMapping(
          value = "/cambio/user",
          method = RequestMethod.GET)
  public ResponseEntity<?> getCambiosByUser()
  {
      logger.info("Service: get all cambios of one user");

      // El tipo 1 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 1;
      return getNotificacionesByUser(tipoNotificacion);
  }

  /**
  * API: Create a request to delete a change notification
  */
  @RequestMapping(
          value = "/cambio/{id_cambio}",
          method = RequestMethod.DELETE)
  public ResponseEntity<?> deleteCambio(@PathVariable("id_cambio") int id_cambio)
  {
      logger.info("Service: delete cambio by id");

      // El tipo 1 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 1;
      return deleteNotificacion(tipoNotificacion, id_cambio);
  }

  /**
  * API: Create a request to create a 'incidencia' notification
  */
  @RequestMapping(
          value = "/incidencia",
          method = RequestMethod.POST)
  public ResponseEntity<?> createIncidencia(
    @RequestBody(required=false) Notificacion notificacion)
  {
      logger.info("Service: create incidencia");

      // El tipo 2 equivale a un incidencia (todos los usuarios)
      int tipoNotificacion = 2;
      return createNotificacion(tipoNotificacion, notificacion);
  }

  /**
  * API: Create a request to update a change notification
  */
  @RequestMapping(
          value = "/incidencia/{id_incidencia}",
          method = RequestMethod.PUT)
  public ResponseEntity<?> updateIncidencia(
    @RequestBody(required=false) Notificacion notificacion,
    @PathVariable("id_incidencia") int id_incidencia)
  {
      logger.info("Service: update incidencia");

      // El tipo 2 equivale a un cambio (todos los usuarios)
      int tipoNotificacion = 2;
      return updateNotificacion(tipoNotificacion, id_incidencia, notificacion);
  }

  /**
  * API: Create a request to retrieve a incidencia notificacion
  */
  @RequestMapping(
          value = "/incidencia/{id_incidencia}",
          method = RequestMethod.GET)
  public ResponseEntity<?> getIncidencia(
      @PathVariable("id_incidencia") int id_incidencia)
  {
      logger.info("Service: get incidencia by id");

      // El tipo 2 equivale a un cambio (usuario registrado)
      int tipoNotificacion = 2;
      return getNotificacion(tipoNotificacion, id_incidencia);
  }

  /**
  * API: Create a request to retrieve all incidence notifications
  */
  @RequestMapping(
          value = "/incidencia",
          method = RequestMethod.GET)
  public ResponseEntity<?> getIncidencias()
  {
      logger.info("Service: get all incidencias");

      // El tipo 2 equivale a una incidencia (usuario registrado)
      int tipoNotificacion = 2;
      return getNotificaciones(tipoNotificacion);
  }

  /**
  * API: Create a request to delete a incidencia notification
  */
  @RequestMapping(
          value = "/incidencia/{id_incidencia}",
          method = RequestMethod.DELETE)
  public ResponseEntity<?> deleteIncidencia(
      @PathVariable("id_incidencia") int id_incidencia)
  {
      logger.info("Service: delete incidencia by id");

      // El tipo 2 equivale a una incidencia (cualquier usuario)
      int tipoNotificacion = 2;
      return deleteNotificacion(tipoNotificacion, id_incidencia);
  }

  /**
  * API: Create a request to retrieve all notifications
  */
  @RequestMapping(
          value = "",
          method = RequestMethod.GET)
  public ResponseEntity<?> getAllNotificaciones()
  {
      logger.info("Service: get all notificaciones");

      // El tipo 0 equivale a todas las notificaciones (usuario registrado)
      int tipoNotificacion = 0;
      return getNotificaciones(tipoNotificacion);
  }

  /**
  * API: Create a request to retrieve all notifications
  */
  @RequestMapping(
          value = "",
          method = RequestMethod.DELETE)
  public ResponseEntity<?> deleteAllNotificaciones()
  {
      logger.info("Service: delete all notificaciones");

      // El tipo 0 equivale a todas las notificaciones (usuario registrado)
      int tipoNotificacion = 0;
      return deleteNotificaciones(tipoNotificacion);
  }

  /**
	* API: Upload single file using Spring Controller
	*/
	@RequestMapping(
					value = "/photo",
					method = RequestMethod.POST)
	public ResponseEntity<?> uploadNotificationPhoto(
                        @RequestParam("name") String name,
                  			@RequestParam("file") MultipartFile file,
                        @RequestParam("id_notificacion") int id_notificacion) {

        logger.info("Service: upload a notification photo");
        return updateNotificationPhoto(name, file, id_notificacion);
  }

  // NO MORE ENDPOINTS BELOW //

  private ResponseEntity<?> updateNotificationPhoto(String name,
        MultipartFile file, int id_notificacion) {

    if (!file.isEmpty()) {
			try
			{

        // Inserts photo name with its notification info
        insertNotificationPhoto(name, id_notificacion);

        // Obtains room identifier from photo name ('roomId_dateAndTime.jpeg')
				String[] photoNameParts = name.split("_");
				String roomId = photoNameParts[0];

        // Creates file with photo data
				byte[] bytes = file.getBytes();
				logger.info("File path", photosPath + File.separator);
				File dir = new File(photosPath + File.separator);

				if (!dir.exists())
					dir.mkdirs();

				// Creates file on server
				File serverFile = new File(dir.getAbsolutePath() + File.separator + name);
				BufferedOutputStream stream = new BufferedOutputStream( new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				logger.info("Server File Location=" + serverFile.getAbsolutePath());

        return new ResponseEntity<>(HttpStatus.OK);
			}
			catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			return new ResponseEntity<>("Photo upload failed because file " + name + " was empty", HttpStatus.INTERNAL_SERVER_ERROR);
		}
  }

  private ResponseEntity<?> insertNotificationPhoto(String name, int id_notificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsInserted = 0;

    try {

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      String query = "UPDATE tb_notificaciones" +
                        " SET foto=?" +
                        " WHERE id_notificacion ='" + id_notificacion + "'";

      preparedStmt = connection.prepareStatement(query);
      preparedStmt.setString(1, name);
      rowsInserted = preparedStmt.executeUpdate();

      if (rowsInserted > 0) {
          return new ResponseEntity<>(gson.toJson(name), HttpStatus.OK);
      }
      else {
          return new ResponseEntity<>("Error creating notificacion",
            HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  private ResponseEntity<?> createNotificacion(int tipoNotificacion,
      Notificacion notificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsInserted = 0;

    try {

      // Obtains the username of current user from spring security context
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      String username = auth.getName();

      // Creates current date and time
      LocalDateTime actualDate = LocalDateTime.now();
      Timestamp creationDateTime = Timestamp.from(actualDate.toInstant(ZoneOffset.ofHours(2)));

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      String query = "INSERT INTO tb_notificaciones(" +
        "tipo_notificacion,id_espacio,descripcion,fecha,id_usuario," +
        "id_admin_validador,estado,foto,email_usuario,comentario_admin" +
        ")" +
        "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      preparedStmt = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
      preparedStmt.setInt(1, tipoNotificacion);
      preparedStmt.setString(2, notificacion.getId_espacio());
      preparedStmt.setString(3, notificacion.getDescripcion());
      preparedStmt.setTimestamp(4, creationDateTime);
      preparedStmt.setString(5, username); // uses token to obtain username
      preparedStmt.setString(6, notificacion.getId_admin_validador());
      preparedStmt.setString(7, notificacion.getEstado());
      preparedStmt.setString(8, notificacion.getFoto());
      preparedStmt.setString(9, notificacion.getEmail_usuario());
      preparedStmt.setString(10, notificacion.getComentario_admin());

      rowsInserted = preparedStmt.executeUpdate();

      if (rowsInserted > 0) {

          // Returns the id of the last inserted row
          ResultSet rs = preparedStmt.getGeneratedKeys();
          int last_id = 0;
          if (rs.next()) {
            last_id = rs.getInt(1);
          }

          return new ResponseEntity<>(gson.toJson(last_id), HttpStatus.OK);
      }
      else {
          return new ResponseEntity<>("Error creating notificacion",
            HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  private ResponseEntity<?> getNotificacion(int tipoNotificacion,
      int id_notificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsInserted = 0;

    try {

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      Notificacion notificacion = new Notificacion();
      String query = "SELECT * FROM tb_notificaciones " +
                      "WHERE id_notificacion = '" + id_notificacion + "' " +
                      "AND tipo_notificacion = '" + tipoNotificacion + "'";

      preparedStmt = connection.prepareStatement(query);
      ResultSet rs = preparedStmt.executeQuery();

      if(rs.next()) {

        // Builds the notificacion object to be returned
        notificacion.setId_notificacion(rs.getInt("id_notificacion"));
        notificacion.setTipo_notificacion(rs.getInt("tipo_notificacion"));
        notificacion.setId_espacio(rs.getString("id_espacio"));
        notificacion.setDescripcion(rs.getString("descripcion"));
        notificacion.setFecha(rs.getTimestamp("fecha").toLocalDateTime());
        notificacion.setId_usuario(rs.getString("id_usuario"));
        notificacion.setId_admin_validador(rs.getString("id_admin_validador"));
        notificacion.setEstado(rs.getString("estado"));
        notificacion.setFoto(rs.getString("foto"));
        notificacion.setEmail_usuario(rs.getString("email_usuario"));
        notificacion.setComentario_admin(rs.getString("comentario_admin"));

        return new ResponseEntity<>(gson.toJson(notificacion), HttpStatus.OK);
      }
      else {
          return new ResponseEntity<>("Error obtaining notificacion",
            HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  private ResponseEntity<?> getNotificaciones(int tipoNotificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsInserted = 0;

    try {

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      ArrayList<Notificacion> notificaciones = new ArrayList<Notificacion>();
      String query = "SELECT * FROM tb_notificaciones";

      // Checks for a type if the type is not set to 0 (searches for all types
      // of notification)
      if (tipoNotificacion > 0) {
        query += " WHERE tipo_notificacion = '" + tipoNotificacion + "'";
      }

      preparedStmt = connection.prepareStatement(query);
      ResultSet rs = preparedStmt.executeQuery();

      while(rs.next()) {

        // Builds the notificacion object to be returned
        Notificacion notificacion = new Notificacion();
        notificacion.setId_notificacion(rs.getInt("id_notificacion"));
        notificacion.setTipo_notificacion(rs.getInt("tipo_notificacion"));
        notificacion.setId_espacio(rs.getString("id_espacio"));
        notificacion.setDescripcion(rs.getString("descripcion"));
        notificacion.setFecha(rs.getTimestamp("fecha").toLocalDateTime());
        notificacion.setId_usuario(rs.getString("id_usuario"));
        notificacion.setId_admin_validador(rs.getString("id_admin_validador"));
        notificacion.setEstado(rs.getString("estado"));
        notificacion.setFoto(rs.getString("foto"));
        notificacion.setEmail_usuario(rs.getString("email_usuario"));
        notificacion.setComentario_admin(rs.getString("comentario_admin"));

        // Obtiene informacion adicional sobre el espacio
        Estancias estanciasRestController = new Estancias();
        ResultSet info = estanciasRestController.getRoomInfo(
          connection, notificacion.getId_espacio());

        if (info.next()){
          notificacion.setCiudad(info.getString("ciudad"));
          notificacion.setCampus(info.getString("campus"));
          notificacion.setEdificio(info.getString("edificio"));
          notificacion.setPlanta(info.getString("floors"));
          notificacion.setEspacio(info.getString("id_centro"));
          notificacion.setDireccion(info.getString("dir"));
        }

        notificaciones.add(notificacion);
      }
      return new ResponseEntity<>(gson.toJson(notificaciones), HttpStatus.OK);
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  private ResponseEntity<?> getNotificacionesByUser(int tipoNotificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsInserted = 0;

    try {

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      // Obtains the username of current user from spring security context
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      String username = auth.getName();

      ArrayList<Notificacion> notificaciones = new ArrayList<Notificacion>();
      String query = "SELECT * FROM tb_notificaciones";
      query+= " WHERE id_usuario = '" + username + "'";

      // Checks for a type if the type is not set to 0 (searches for all types
      // of notification)
      if (tipoNotificacion > 0) {
        query += " AND tipo_notificacion = '" + tipoNotificacion + "'";
      }

      System.out.println("Query: " + query);

      preparedStmt = connection.prepareStatement(query);
      ResultSet rs = preparedStmt.executeQuery();

      while(rs.next()) {

        // Builds the notificacion object to be returned
        Notificacion notificacion = new Notificacion();
        notificacion.setId_notificacion(rs.getInt("id_notificacion"));
        notificacion.setTipo_notificacion(rs.getInt("tipo_notificacion"));
        notificacion.setId_espacio(rs.getString("id_espacio"));
        notificacion.setDescripcion(rs.getString("descripcion"));
        notificacion.setFecha(rs.getTimestamp("fecha").toLocalDateTime());
        notificacion.setId_usuario(rs.getString("id_usuario"));
        notificacion.setId_admin_validador(rs.getString("id_admin_validador"));
        notificacion.setEstado(rs.getString("estado"));
        notificacion.setFoto(rs.getString("foto"));
        notificacion.setEmail_usuario(rs.getString("email_usuario"));
        notificacion.setComentario_admin(rs.getString("comentario_admin"));

        // Obtiene informacion adicional sobre el espacio
        // Estancias estanciasRestController = new Estancias();
        // ResultSet info = estanciasRestController.getRoomInfo(
        //   connection, notificacion.getId_espacio());
        //
        // if (info.next()){
        //   notificacion.setCiudad(info.getString("ciudad"));
        //   notificacion.setCampus(info.getString("campus"));
        //   notificacion.setEdificio(info.getString("edificio"));
        //   notificacion.setPlanta(info.getString("floors"));
        //   notificacion.setEspacio(info.getString("id_centro"));
        //   notificacion.setDireccion(info.getString("dir"));
        // }

        notificaciones.add(notificacion);
      }
      return new ResponseEntity<>(gson.toJson(notificaciones), HttpStatus.OK);
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  private ResponseEntity<?> updateNotificacion(int tipoNotificacion,
    int id_notificacion, Notificacion notificacion)
  {
  	Connection connection = null;
  	PreparedStatement preparedStmt = null;
    try
    {
    	logger.info("Service: update notificacion");
    	connection = ConnectionManager.getConnection();

      // COALESCE: tiene 2 parametros, aplica el primero que no sea null,
      // de esta forma, los atributos de la nueva peticion de actualizacion
      // que sean null no se insertan en la base de datos, ya que utiliza
      // el segunda parametro que representa el dato existente en la base de
      // datos
    	String query = "UPDATE tb_notificaciones SET" +
                          " tipo_notificacion = COALESCE(?,tipo_notificacion)," +
                          " id_espacio = COALESCE(?,id_espacio)," +
                          " descripcion = COALESCE(?,descripcion)," +
                          " id_usuario = COALESCE(?,id_usuario)," +
                          " id_admin_validador = COALESCE(?,id_admin_validador)," +
                          " estado = COALESCE(?,estado)," +
                          " foto = COALESCE(?,foto)," +
                          " email_usuario = COALESCE(?,email_usuario)," +
                          " comentario_admin = COALESCE(?,comentario_admin)" +
                          " WHERE id_notificacion = '" + id_notificacion + "'" +
                          " AND tipo_notificacion = '" + tipoNotificacion + "'";

      preparedStmt = connection.prepareStatement(query);
      preparedStmt.setInt(1, tipoNotificacion);
      preparedStmt.setString(2, notificacion.getId_espacio());
      preparedStmt.setString(3, notificacion.getDescripcion());
      preparedStmt.setString(4, notificacion.getId_usuario());
      preparedStmt.setString(5, notificacion.getId_admin_validador());
      preparedStmt.setString(6, notificacion.getEstado());
      preparedStmt.setString(7, notificacion.getFoto());
      preparedStmt.setString(8, notificacion.getEmail_usuario());
      preparedStmt.setString(9, notificacion.getComentario_admin());

      int rowsUpdated = preparedStmt.executeUpdate();

      if (rowsUpdated > 0) {
        return new ResponseEntity<>("Success updating notification data with ID: " +
          id_notificacion, HttpStatus.OK);
      }
      else {

        return new ResponseEntity<>("Error updating photo data with ID: " +
          id_notificacion, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
		finally {
			try { if (preparedStmt != null) preparedStmt.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
      try { if (connection != null) connection.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
		}
  }

  private ResponseEntity<?> deleteNotificacion(int tipoNotificacion,
      int id_notificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsDeleted = 0;

    try {
      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      Notificacion notificacion = new Notificacion();
      String query = "DELETE FROM tb_notificaciones " +
                      "WHERE id_notificacion = '" + id_notificacion + "' " +
                      "AND tipo_notificacion = '" + tipoNotificacion + "'";

      preparedStmt = connection.prepareStatement(query);
      rowsDeleted = preparedStmt.executeUpdate();

      if (rowsDeleted > 0) {
        return new ResponseEntity<>(gson.toJson("Notificacion eliminada"), HttpStatus.OK);
      }
      else {
          return new ResponseEntity<>("Error deleting notificacion",
            HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  private ResponseEntity<?> deleteNotificaciones(int tipoNotificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;
    int rowsDeleted = 0;

    try {
      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      Notificacion notificacion = new Notificacion();
      String query = "DELETE FROM tb_notificaciones";

      preparedStmt = connection.prepareStatement(query);
      rowsDeleted = preparedStmt.executeUpdate();

      if (rowsDeleted > 0) {
        return new ResponseEntity<>(gson.toJson("Notificaciones eliminadas"),
            HttpStatus.OK);
      }
      else {
          return new ResponseEntity<>("Error deleting notificacion",
            HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
        try { if (preparedStmt != null) preparedStmt.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
        try { if (connection != null) connection.close(); }
        catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  // MAS METODOS DEL API

}
