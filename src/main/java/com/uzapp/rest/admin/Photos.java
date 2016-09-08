package com.uzapp.rest.admin;

import com.uzapp.dominio.Photo;

import com.uzapp.bd.ConnectionManager;
import com.uzapp.rest.busquedas.EstanciasRestController;

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
	private String photosPath = "www\\images\\photos\\";

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

      EstanciasRestController estanciasRestController = new EstanciasRestController();
      Photo photo = null;
      ResultSet info = estanciasRestController.getInfoEstancia(connection, room);
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
											null);
			}
			return photo;
    }

    /**
    *	Insert photo request object into the database
    */
    private ResponseEntity<?> insertPhotoRequest(Photo photo, Connection connection)
    {
    	try {

  			Gson gson = new Gson();

        String query = "INSERT INTO photos(name,city,campus,building,floor,room_id,room_name,created,email,status) values (?,?,?,?,?,?,?,?,?,?)";
        PreparedStatement preparedStmt = connection.prepareStatement(query);

        preparedStmt.setString(1, photo.getName());
        preparedStmt.setString(2, photo.getCity());
        preparedStmt.setString(3, photo.getCampus());
        preparedStmt.setString(4, photo.getBuilding());
        preparedStmt.setString(5, photo.getFloor());
        preparedStmt.setString(6, photo.getRoomId());
        preparedStmt.setString(7, photo.getRoomName());
        preparedStmt.setTimestamp(8, Timestamp.from(photo.getCreated().toInstant(ZoneOffset.ofHours(0))));
        preparedStmt.setString(9, photo.getEmail());
        preparedStmt.setString(10, photo.getStatus());
        int rowsInserted =preparedStmt.executeUpdate();

        if (rowsInserted > 0) {
            return new ResponseEntity<>(gson.toJson(photo), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Error creating Photo request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } catch (SQLException e) {
          e.printStackTrace();
          return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


	/**
	 * Returns all the photos names given a room ID
	 */
	@RequestMapping(
					value = "/{roomId}", 
					method = RequestMethod.GET)
	public ResponseEntity<?> count(@PathVariable("roomId") String roomId)
	{
		try {
			logger.info("GET photos for room " + roomId);

			Connection connection = ConnectionManager.getConnection();

			ArrayList<String> images = new ArrayList<String>();

			String query = "SELECT name FROM photos where room_id='"+roomId+"' and status='Approved'";
			PreparedStatement preparedStmt = connection.prepareStatement(query);
			logger.info("Query: " + query);

			ResultSet rs = preparedStmt.executeQuery();
			List<String> result = new ArrayList<String>();
			while (rs.next()){
				images.add(rs.getString("name"));
			}

			return new ResponseEntity<>(images, HttpStatus.OK);
		}
		catch (Exception e){
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Upload single file using Spring Controller
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
			try {

				String[] photoNameParts = name.split("_");
				String roomId = photoNameParts[0];

				Connection connection = ConnectionManager.getConnection();
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
						String fullPath = appPath + photosPath;
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
		} else {
			return new ResponseEntity<>("Photo upload failed because file " + name + " was empty", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

  @RequestMapping(
        value = "/**",
        method = RequestMethod.OPTIONS)
  public ResponseEntity handle() {
      return new ResponseEntity(HttpStatus.OK);
  }
}