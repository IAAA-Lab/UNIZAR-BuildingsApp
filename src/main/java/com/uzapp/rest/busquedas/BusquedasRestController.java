package com.uzapp.rest.busquedas;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.google.gson.Gson;
import com.uzapp.bd.ConnectionManager;
import com.uzapp.dominio.Campus;
import com.uzapp.dominio.Edificio;
import com.uzapp.dominio.Espacios;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/busquedas")
public class BusquedasRestController {
	
	private static final Logger logger = LoggerFactory.getLogger(BusquedasRestController.class);
	
	@RequestMapping(
			value = "/codigoespacios", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> codigoEspacios()
	{
		logger.info("Servicio: codigoEspacios()");
		Connection connection = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"ID_ESPACIO\" FROM \"TB_ESPACIOS\" ORDER BY \"ID_ESPACIO\" ASC";

			List<Espacios> resultado = new ArrayList<Espacios>();

			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Espacios(respuesta.getString("ID_ESPACIO")));
			}
			System.out.println("resultado"+gson.toJson(resultado));
			connection.close();
      return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
		}
		catch (SQLException e) {
        e.printStackTrace();
        if (connection != null) {
        	try { connection.close(); }
        	catch(SQLException excep) { excep.printStackTrace(); }
        }
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(
			value = "/campus", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> campus(@RequestParam("ciudad") String ciudad)
	{
		logger.info("Servicio: campus()");
		Connection connection = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"ID\" , \"CAMPUS\" FROM \"TB_CODIGOS_DE_CAMPUS\" ";
			query += "WHERE \"CIUDAD\" = "+ciudad+" ORDER BY \"CAMPUS\" ASC";

			System.out.println(query);

			List<Campus> resultado = new ArrayList<Campus>();
		
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Campus(respuesta.getInt("ID"),respuesta.getString("CAMPUS")));
			}

			System.out.println("resultado"+gson.toJson(resultado));
			connection.close();
      return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
		}
		catch (SQLException e) {
        e.printStackTrace();
        if (connection != null) {
        	try { connection.close(); }
        	catch(SQLException excep) { excep.printStackTrace(); }
        }
	      return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(
			value = "/edificio", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> edificio(@RequestParam("campus") String campus)
	{
		logger.info("Servicio: edificio()");
		Connection connection = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"ID_EDIFICIO\" , \"EDIFICIO\", \"DIRECCION\" ";
			query += "FROM \"TB_EDIFICIOS\" WHERE \"CAMPUS\" = "+campus +" ORDER BY \"EDIFICIO\" ASC";

			System.out.println(query);

			List<Edificio> resultado = new ArrayList<Edificio>();
		
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				String idEdificio= respuesta.getString("ID_EDIFICIO");
				resultado.add(new Edificio(idEdificio,respuesta.getString("EDIFICIO"),respuesta.getString("DIRECCION"),obtenerPlantasEdificio(connection,idEdificio)));
			}

			System.out.println("resultado"+gson.toJson(resultado));
			connection.close();
      return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
		}
		catch (SQLException e) {
        e.printStackTrace();
        if (connection != null) {
        	try { connection.close(); }
        	catch(SQLException excep) { excep.printStackTrace(); }
        }
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(
			value = "/infoedificio", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> infoEdificio(@RequestParam("edificio") String edificio)
	{
		logger.info("Servicio: edificio()");
		Connection connection = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"ID_EDIFICIO\" , \"EDIFICIO\", \"DIRECCION\" ";
			query += "FROM \"TB_EDIFICIOS\" WHERE \"ID_EDIFICIO\" = '"+edificio+"'";

			System.out.println(query);

			List<Edificio> resultado = new ArrayList<Edificio>();
		
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				String idEdificio= respuesta.getString("ID_EDIFICIO");
				resultado.add(new Edificio(idEdificio,respuesta.getString("EDIFICIO"),respuesta.getString("DIRECCION"),obtenerPlantasEdificio(connection,idEdificio)));
			}

			System.out.println("resultado"+gson.toJson(resultado));
			connection.close();
      return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
		}
		catch (SQLException e) {
        e.printStackTrace();
        if (connection != null) {
        	try { connection.close(); }
        	catch(SQLException excep) { excep.printStackTrace(); }
        }
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	private static List<String> obtenerPlantasEdificio(Connection connection,String idEdificio)
	{
		List<String> plantas = new ArrayList<String>();
		
		try {
			String query = "SELECT DISTINCT SUBSTRING(\"ID_UTC\",1,2) AS \"Pisos\" ";
			query += "FROM \"TB_ESPACIOS\" WHERE \"ID_EDIFICIO\" = '" + idEdificio +"' ORDER BY \"Pisos\" ASC";
		
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();
			while (respuesta.next()){
				plantas.add(respuesta.getString("Pisos"));
			}
		}
		catch (SQLException e) {
        e.printStackTrace();
		}
		return plantas;
	}
}
