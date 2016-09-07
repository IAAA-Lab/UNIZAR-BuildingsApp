package com.uzapp.rest.admin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.BufferedOutputStream;
import java.util.ArrayList;

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
	 * Returns all the photos names given a room ID
	 */
	@RequestMapping(
					value = "/{roomId}", 
					method = RequestMethod.GET)
	public ResponseEntity<?> count(@PathVariable("roomId") String roomId)
	{
		try {
			// get absolute path of the application
			String appPath = context.getRealPath("");
			System.out.println("appPath = " + appPath);

			// construct the complete absolute path of the file
			String fullPath = appPath + photosPath;
			System.out.println("fullPath = " + fullPath);
			
			File photosDir = new File(fullPath);
			File[] photosListing = photosDir.listFiles();

			ArrayList<String> images = new ArrayList<String>();

			if (photosListing != null) {
				for (File photo : photosListing) {
					if (photo.getName().toLowerCase().contains(roomId.toLowerCase())) {
						images.add(photo.getName());
					}
				}
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
	public String uploadFileHandler(@RequestParam("name") String name, @RequestParam("file") MultipartFile file)
	{
		if (!file.isEmpty()) {
			try {
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

				return "You successfully uploaded file=" + name;
			} catch (Exception e) {
				return "You failed to upload " + name + " => " + e.getMessage();
			}
		} else {
			return "You failed to upload " + name + " because the file was empty.";
		}
	}

  @RequestMapping(
        value = "/**",
        method = RequestMethod.OPTIONS)
  public ResponseEntity handle() {
      return new ResponseEntity(HttpStatus.OK);
  }
}