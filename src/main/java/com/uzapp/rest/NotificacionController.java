package com.uzapp.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
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
import java.util.Base64;

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

import javax.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/notificacion")
public class NotificacionController {

  private static final Logger logger =
    LoggerFactory.getLogger(NotificacionController.class);

  // Base photos path
	private static String photosPath = "";
  private static String photosNotificationsPath = "";

	// Initalize photos base path var from config properties file
	static {
		try {
			InputStream input = NotificacionController.class.getClassLoader()
                                  .getResourceAsStream("config.properties");
			Properties prop = new Properties();
			prop.load(input);
			photosPath = prop.getProperty("photos_path");
      photosNotificationsPath = prop.getProperty("photos_notifications_path");
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
  * API: Create a request to delte all cambios
  */
  @RequestMapping(
          value = "/cambio",
          method = RequestMethod.DELETE)
  public ResponseEntity<?> deleteAllCambios()
  {
      logger.info("Service: delete all cambios");

      // El tipo 0 equivale a todas las notificaciones (usuario registrado)
      int tipoNotificacion = 1;
      return deleteNotificaciones(tipoNotificacion);
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
          value = "/incidencia",
          method = RequestMethod.DELETE)
  public ResponseEntity<?> deleteAllIncidencias()
  {
      logger.info("Service: delete all incidencias");

      // El tipo 0 equivale a todas las notificaciones (usuario registrado)
      int tipoNotificacion = 2;
      return deleteNotificaciones(tipoNotificacion);
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

  /**
  * API: Download single file using Spring Controller
  */
  @RequestMapping(
          value = "/imagen/{id_imagen}",
          method = RequestMethod.GET)
  public ResponseEntity<?> getPhoto(
      @PathVariable("id_imagen") String id_imagen,
      HttpServletResponse response) {

        logger.info("Service: obtain a photo by name");
        return getPhotoByName(id_imagen, response);
  }

  // NO MORE ENDPOINTS BELOW //

  private ResponseEntity<?> getPhotoByName(String name, HttpServletResponse response) {
    FileInputStream fis = null;

    if(!name.equals("")){
      try
      {
        String imageString = null;
        String fullName = photosNotificationsPath + name + ".jpg";

        // // Creates a byte[] with photo name
        logger.info("Photo name", fullName);
        File file = new File(fullName);
        byte[] image = new byte[(int) file.length()];

        // Reads image bytes into 'bytesArray'
        fis = new FileInputStream(file);
        fis.read(image);

        // Converts image to base64
        Base64.Encoder encoder = Base64.getEncoder();
        imageString = encoder.encodeToString(image);

        // Sets contentType
        // response.setContentType("image/png");
        // response.setContentType("image/jpg");
        return new ResponseEntity<>(imageString, HttpStatus.OK);
      }
      catch (Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
      finally {
        try {
          if (fis != null) fis.close();
        }
        catch (Exception excep) { excep.printStackTrace(); }
      }
    } else {
      return new ResponseEntity<>("Photo download failed because name " + name + " was empty", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private ResponseEntity<?> updateNotificationPhoto(String name,
        MultipartFile file, int id_notificacion) {

    FileOutputStream fos = null;
    BufferedOutputStream stream = null;

    if (!file.isEmpty()) {
			try
			{

        // Deletes previous image from disk
        deleteImagenNotificacion(id_notificacion);

        // Inserts photo name with its notification info
        insertNotificationPhoto(name, id_notificacion);

        System.out.println("Nombre de imagen recibido: " + name);

        // Obtains room identifier from photo name ('roomId_dateAndTime.jpeg')
				String[] photoNameParts = name.split("_");
				String roomId = photoNameParts[0];

        System.out.println("RoomId: " + roomId);

        // Creates file with photo data
				byte[] bytes = file.getBytes();
				logger.info("File path", photosNotificationsPath + File.separator);
				File dir = new File(photosNotificationsPath + File.separator);

				if (!dir.exists())
					dir.mkdirs();

				// Creates file on server
        System.out.println("NombreFinal: " + dir.getAbsolutePath() + File.separator + name);
				File serverFile = new File(dir.getAbsolutePath() + File.separator + name);
        fos = new FileOutputStream(serverFile);
				stream = new BufferedOutputStream(fos);
				stream.write(bytes);
				stream.close();
        fos.close();

				logger.info("Server File Location=" + serverFile.getAbsolutePath());

        return new ResponseEntity<>(HttpStatus.OK);
			}
			catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
      finally {
        try {
          if (stream != null) stream.close();
          if (fos != null) fos.close();
        }
        catch (Exception excep) { excep.printStackTrace();}
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
      String username = "Invitado";

      if (auth != null) username = auth.getName();

      // Creates current date and time
      LocalDateTime actualDate = LocalDateTime.now();
      Timestamp creationDateTime = Timestamp.from(actualDate.toInstant(ZoneOffset.ofHours(2)));

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      String query = "INSERT INTO tb_notificaciones(" +
        "tipo_notificacion,id_espacio,descripcion,fecha,id_usuario," +
        "id_admin_validador,estado,foto,email_usuario,comentario_admin," +
        "fecha_ultima_modificacion)" +
        "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
      preparedStmt.setTimestamp(11, creationDateTime);

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
        notificacion.setFechaUltimaModificacion(rs.getTimestamp("fecha_ultima_modificacion").toLocalDateTime());

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

      // Ordena las notifiaciones de mas reciente a menos reciente
      query += " ORDER BY fecha_ultima_modificacion DESC";

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
        notificacion.setFechaUltimaModificacion(rs.getTimestamp("fecha_ultima_modificacion").toLocalDateTime());

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

      // Ordena las notifiaciones de mas reciente a menos reciente
      query += " ORDER BY fecha_ultima_modificacion DESC";

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
        notificacion.setFechaUltimaModificacion(rs.getTimestamp("fecha_ultima_modificacion").toLocalDateTime());

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

  private ResponseEntity<?> updateNotificacion(int tipoNotificacion,
    int id_notificacion, Notificacion notificacion)
  {
  	Connection connection = null;
  	PreparedStatement preparedStmt = null;
    try
    {
    	logger.info("Service: update notificacion");

      // Creates current date and time
      LocalDateTime actualDate = LocalDateTime.now();
      Timestamp updateDateTime = Timestamp.from(actualDate.toInstant(ZoneOffset.ofHours(2)));

      Gson gson = new Gson();
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
                          " comentario_admin = COALESCE(?,comentario_admin)," +
                          " fecha_ultima_modificacion = ?" +
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
      preparedStmt.setTimestamp(10, updateDateTime);

      int rowsUpdated = preparedStmt.executeUpdate();

      if (rowsUpdated > 0) {
        String res = "Success updating notification data with ID: " + id_notificacion;
        return new ResponseEntity<>(gson.toJson(res), HttpStatus.OK);
      }
      else {
          String res = "Error updating notification data with ID: " + id_notificacion;
        return new ResponseEntity<>(gson.toJson(res), HttpStatus.INTERNAL_SERVER_ERROR);
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

      // Primero elimina del servidor la imagen asociada a la notificacion
      deleteImagenNotificacion(id_notificacion);

      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

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

      if (tipoNotificacion != 0) {
        query += " WHERE tipo_notificacion = " + tipoNotificacion;
      }

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

  private void deleteImagenNotificacion(int id_notificacion) {
    Connection connection = null;
    PreparedStatement preparedStmt = null;

    try {
      Gson gson = new Gson();
      connection = ConnectionManager.getConnection();

      String query = "SELECT foto FROM tb_notificaciones " +
                            "WHERE id_notificacion = '" + id_notificacion + "'";

      preparedStmt = connection.prepareStatement(query);
      ResultSet rs = preparedStmt.executeQuery();

      if (rs.next()) {

        String name = rs.getString("foto");
        System.out.println(name);

        //Delete photo from disk
        String fullPathFile = photosNotificationsPath + name;
        logger.info("File path to delete", fullPathFile);

        System.out.println(fullPathFile);
        File fileToDelete = new File(fullPathFile);

        // File dir = new File(photosNotificationsPath + File.separator);
        // File fileToDelete = new File(dir.getAbsolutePath() + File.separator + name);
        // System.out.println(fileToDelete.getAbsolutePath());

        // Unlocks previous locks and allows to delete file
        // FileOutputStream fos = new FileOutputStream(fileToDelete);
        // fos.close();

	      Files.delete(fileToDelete.toPath());
        System.out.println("Imagen borrada correctamente: " + fullPathFile);
      }
    }
    catch (Exception e) {
        e.printStackTrace();
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
