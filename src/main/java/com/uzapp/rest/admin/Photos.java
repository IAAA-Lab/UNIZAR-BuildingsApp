package com.uzapp.rest.admin;

import com.uzapp.dominio.Photo;

import com.uzapp.bd.ConnectionManager;
import com.uzapp.rest.busquedas.Estancias;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import com.google.gson.Gson;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.BufferedOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.lang.Character;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/photos")
public class Photos {

	private static final Logger logger = LoggerFactory.getLogger(Photos.class);

	// Base path
	private String photosPath = "www/images/photos/";

	@Autowired
	private ServletContext context;

	/**
	* Create Photo request object from photo name
	*/
  private Photo createRequestObject(String name, String email, String mode, Connection connection) throws SQLException
  {
    logger.info("Creating photo request from photo name");

    String[] photoNameParts = name.split("_");
    String room = photoNameParts[0];
    String[] roomParts = room.split("\\.");
    String floor = roomParts[roomParts.length-2];

    String status = "";
    if (mode.equals("admin")) status = "Approved";
    else status = "Pending";

    Estancias estanciasRestController = new Estancias();
    Photo photo = null;
    logger.info("Room passed: " + room);
    ResultSet info = estanciasRestController.getRoomInfo(connection, room);
    if (info.next()){
			photo = new Photo(LocalDateTime.now(), 
										name, 
										info.getString("ciudad"),
										info.getString("campus"),
										info.getString("edificio"),
										info.getString("ID_ESPACIO"),
										info.getString("ID_CENTRO"),
										floor,
										status,
										email);
		}
		return photo;
  }

  /**
  *	Insert photo request object into the database
  */
  private ResponseEntity<?> insertPhotoRequest(Photo photo, Connection connection)
  {
  	PreparedStatement preparedStmt = null;
  	try
  	{
			Gson gson = new Gson();

      String query = "INSERT INTO photos(name,city,campus,building,floor,room_id,room_name,created,email,status,updated) values (?,?,?,?,?,?,?,?,?,?,?)";
      preparedStmt = connection.prepareStatement(query);

      Timestamp created = Timestamp.from(photo.getCreated().toInstant(ZoneOffset.ofHours(2)));
      Timestamp updated = Timestamp.from(photo.getCreated().toInstant(ZoneOffset.ofHours(2)));

      preparedStmt.setString(1, photo.getName());
      preparedStmt.setString(2, photo.getCity());
      preparedStmt.setString(3, photo.getCampus());
      preparedStmt.setString(4, photo.getBuilding());
      preparedStmt.setString(5, photo.getFloor());
      preparedStmt.setString(6, photo.getRoomId());
      preparedStmt.setString(7, photo.getRoomName());
      preparedStmt.setTimestamp(8, created);
      preparedStmt.setString(9, photo.getEmail());
      preparedStmt.setString(10, photo.getStatus());
      preparedStmt.setTimestamp(11, updated);
      int rowsInserted = preparedStmt.executeUpdate();

      if (rowsInserted > 0) {
          return new ResponseEntity<>(gson.toJson(photo), HttpStatus.OK);
      }
      else {
          return new ResponseEntity<>("Error creating Photo request", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    finally {
      try { if (preparedStmt != null) preparedStmt.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
    }
  }

  /**
	 * Returns all the photos data given a status
	 */
	private ResultSet getRoomPhotosByStatus(Connection connection, String roomId, String status) throws Exception
	{
		logger.info("GET photos for room " + roomId + " and status " + status);

		String query = "SELECT name FROM photos where room_id='"+roomId+"' and status='"+status+"'";
		PreparedStatement preparedStmt = connection.prepareStatement(query);
		logger.info("Query: " + query);

		ResultSet rs = preparedStmt.executeQuery();
		return rs;
	}

	/**
	 * Update photo name on disk
	 */
  private boolean changePhotoName(String oldName, String newName) throws Exception
  {
    logger.info("Service: changePhotoName");

		String appPath = context.getRealPath("");
		String fullPathOrig = appPath + File.separator + photosPath + File.separator + oldName;
		logger.info("File orig path", fullPathOrig);

		Path source = Paths.get(fullPathOrig);
		Files.move(source, source.resolveSibling(newName));

		return true;
  }

  /**
	 * Returns all the photos data given a status
	 */
	private int updatePhotoData(Photo photo) throws Exception
	{
		logger.info("UPDATE photo data for photo with ID " + photo.getId());
		Connection connection = ConnectionManager.getConnection();

		String queryUpdate = "UPDATE photos ";
    queryUpdate += "SET  name=?, city=?, campus=?, building=?, floor=?, room_id=?, room_name=?, status=?, reason=?, updated=?, email=?";
    queryUpdate += "WHERE id=?";
    PreparedStatement preparedStmt = connection.prepareStatement(queryUpdate);

    preparedStmt.setString(1, photo.getName());
    preparedStmt.setString(2, photo.getCity());
    preparedStmt.setString(3, photo.getCampus());
    preparedStmt.setString(4, photo.getBuilding());
    preparedStmt.setString(5, photo.getFloor());
    preparedStmt.setString(6, photo.getRoomId());
    preparedStmt.setString(7, photo.getRoomName());
    preparedStmt.setString(8, photo.getStatus());
    preparedStmt.setString(9, photo.getReason());
    preparedStmt.setTimestamp(10, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
    preparedStmt.setString(11, photo.getEmail());
    preparedStmt.setInt(12, photo.getId());
    
    int rowsUpdated = preparedStmt.executeUpdate();
    preparedStmt.close();
    return rowsUpdated;
	} 

	/**
	 * ALL: Returns all the photos names given a room ID
	 */
	@RequestMapping(
					value = "/approved/{roomId}", 
					method = RequestMethod.GET)
	public ResponseEntity<?> getRoomApprovedPhotos(@PathVariable("roomId") String roomId)
	{
		Connection connection = null;
		try {
			logger.info("GET approved photos for room " + roomId);
			connection = ConnectionManager.getConnection();

			ResultSet rs = getRoomPhotosByStatus(connection, roomId, "Approved");
			ArrayList<String> images = new ArrayList<String>();
			while (rs.next()){
				images.add(rs.getString("name"));
			}
			return new ResponseEntity<>(images, HttpStatus.OK);
		}
		catch (Exception e){
			e.printStackTrace();
			if (connection != null) {
          try { connection.close(); }
          catch(SQLException excep) { excep.printStackTrace(); }
      }
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
    finally {
      try { if (connection != null) connection.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
    }
	}

	/**
	 * API: Returns all the photos names given a room ID
	 */
	@RequestMapping(
					value = "/", 
					method = RequestMethod.GET)
	public ResponseEntity<?> getAllPhotos()
	{
		Connection connection = null;
		PreparedStatement preparedStmt = null;
		try {
			logger.info("GET all photos data");
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			ArrayList<String> images = new ArrayList<String>();

			String query = "SELECT * FROM photos";
			preparedStmt = connection.prepareStatement(query);
			logger.info("Query: " + query);

			ResultSet rs = preparedStmt.executeQuery();

			List<Photo> result = new ArrayList<Photo>();
			while (rs.next()){
          result.add(new Photo(
                  rs.getInt("id"),
                  rs.getTimestamp("created").toLocalDateTime(),
                  rs.getString("name"),
                  rs.getString("city"),
                  rs.getString("campus"),
                  rs.getString("building"),
                  rs.getString("room_id"),
                  rs.getString("room_name"),
                  rs.getString("floor"),
                  rs.getString("status"),
                  rs.getString("email"),
                  rs.getTimestamp("updated").toLocalDateTime()));
      }
			return new ResponseEntity<>(gson.toJson(result), HttpStatus.OK);
		}
		catch (Exception e){
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

	/**
	* API: Upload single file using Spring Controller
	*/
	@RequestMapping(
					value = "/upload", 
					method = RequestMethod.POST)
	public ResponseEntity<?> uploadFileHandler(@RequestParam("name") String name,
																						@RequestParam("email") String email,
																						@RequestParam("mode") String mode,
																						@RequestParam("file") MultipartFile file)
	{
		if (!file.isEmpty()) {
			Connection connection = null;
			try 
			{
				connection = ConnectionManager.getConnection();
				String[] photoNameParts = name.split("_");
				String roomId = photoNameParts[0];

				Photo photoRequest = createRequestObject(name, email, mode, connection);

				if (photoRequest != null) {
					ResponseEntity<?> response = insertPhotoRequest(photoRequest, connection);
					connection.close();

					if (response.getStatusCode() == HttpStatus.OK) {
						byte[] bytes = file.getBytes();

						// get absolute path of the application
						String appPath = context.getRealPath("");
						System.out.println("appPath = " + appPath);

						// construct the complete absolute path of the file
						String fullPath = appPath + File.separator + photosPath;
						System.out.println("fullPath = " + fullPath);

						logger.info("File path", fullPath + File.separator);
						File dir = new File(fullPath + File.separator);

						if (!dir.exists())
							dir.mkdirs();

						// Create file on server
						File serverFile = new File(dir.getAbsolutePath() + File.separator + name);
						BufferedOutputStream stream = new BufferedOutputStream( new FileOutputStream(serverFile));
						stream.write(bytes);
						stream.close();

						logger.info("Server File Location=" + serverFile.getAbsolutePath());
					}
					return response;
				}
				else {
					return new ResponseEntity<>("Photo upload failed because data for room with ID " + roomId + " wasn't found", HttpStatus.INTERNAL_SERVER_ERROR);
				}
			}
			catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
			finally {
	      try { if (connection != null) connection.close(); }
	      catch (Exception excep) { excep.printStackTrace(); }
			}
		} else {
			return new ResponseEntity<>("Photo upload failed because file " + name + " was empty", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

  /**
	* API: Update Photo data
	*/
  @RequestMapping(
          value = "/",
          method = RequestMethod.PUT)
  public ResponseEntity<?> update(@RequestBody Photo photo)
  {
  	Connection connection = null;
  	PreparedStatement preparedStmt = null;
    try 
    {
    	logger.info("Service: UPDATE PHOTO");
    	connection = ConnectionManager.getConnection();

    	String querySelect = "SELECT name,room_id FROM photos WHERE id="+photo.getId();
			preparedStmt = connection.prepareStatement(querySelect);
			ResultSet rs = preparedStmt.executeQuery();
			String oldRoomId = null;
			String oldName = null;
			while (rs.next()) {
				oldRoomId = rs.getString("room_id");
				oldName = rs.getString("name");
			}

			int rowsUpdated = 0;
			String newName = photo.getName();
			boolean changeName = (oldRoomId != null && !oldRoomId.equals(photo.getRoomId()));
			
			if (changeName){
				changePhotoName(oldName, newName);
				rowsUpdated = updatePhotoData(photo);
			}
			else {
				rowsUpdated = updatePhotoData(photo);
			}

      if (rowsUpdated > 0) {
        return new ResponseEntity<>("Success updating photo data with ID: " + photo.getId(), HttpStatus.OK);
      }
      else {
      	if (changeName) {
      		changePhotoName(newName, oldName);
      	}
        return new ResponseEntity<>("Error updating photo data with ID: " + photo.getId(), HttpStatus.INTERNAL_SERVER_ERROR);
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

  /**
	* API: Delete Photo by {id}
	*/
  @RequestMapping(
          value = "/{id}",
          method = RequestMethod.DELETE)
  public ResponseEntity<?> deletePhoto(@PathVariable("id") int id)
  {
  	Connection connection = null;
  	PreparedStatement preparedStmt = null;
    try {
    	logger.info("Service: DELETE PHOTO");
    	connection = ConnectionManager.getConnection();

    	//Retrieve photo name
    	String querySelect = "SELECT name FROM photos where id="+id;
			preparedStmt = connection.prepareStatement(querySelect);
			logger.info("Query: " + querySelect);

			String name = null;
			ResultSet rs = preparedStmt.executeQuery();
			while (rs.next()){
				name = rs.getString("name");
			}

			//Delete photo from disk
			String appPath = context.getRealPath("");
			String fullPathFile = appPath + File.separator + photosPath + File.separator + name;
			logger.info("File path to delete", fullPathFile);

			File fileToDelete = new File(fullPathFile);
			if (fileToDelete.delete())
			{
				//Delete photo data from database
				String queryDelete = "DELETE FROM photos WHERE id=?";
	      preparedStmt = connection.prepareStatement(queryDelete);
	      preparedStmt.setInt(1, id);
	      int rowsDeleted = preparedStmt.executeUpdate();

	      if (rowsDeleted > 0) {
	        return new ResponseEntity<>("Success deleting photo "+id+" data from database", HttpStatus.OK);
	      }
	      else {
	        return new ResponseEntity<>("Error deleting photo "+id+" data from database", HttpStatus.INTERNAL_SERVER_ERROR);
	      }
			}
			else {
				return new ResponseEntity<>("Error deleting image from disk", HttpStatus.INTERNAL_SERVER_ERROR);
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

  /**
	* API: Insert new photo info into database table
	*/
	@RequestMapping(
					value = "/insert", 
					method = RequestMethod.POST)
	public ResponseEntity<?> insertPhoto(@RequestBody String name)
	{
		Connection connection = null;
		try 
		{
			connection = ConnectionManager.getConnection();
			String[] photoNameParts = name.split("_");
			String roomId = photoNameParts[0];

			Photo photoRequest = createRequestObject(name, null, "admin", connection);

			if (photoRequest != null) {
				ResponseEntity<?> response = insertPhotoRequest(photoRequest, connection);
				connection.close();
				return response;
			}
			else {
				return new ResponseEntity<>("Photo upload failed because data for room with ID " + roomId + " wasn't found", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		finally {
      try { if (connection != null) connection.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
		}
	}

  @RequestMapping(
        value = "/**",
        method = RequestMethod.OPTIONS)
  public ResponseEntity handle() {
      return new ResponseEntity(HttpStatus.OK);
  }
}