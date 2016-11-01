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
public class Busquedas {
	
	private static final Logger logger = LoggerFactory.getLogger(Busquedas.class);
	
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

			String query = "SELECT DISTINCT \"id_espacio\" FROM \"tb_espacios\" ORDER BY \"ID_ESPACIO\" ASC";

			List<Espacios> resultado = new ArrayList<Espacios>();

			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Espacios(respuesta.getString("id_espacio")));
			}
			System.out.println("resultado"+gson.toJson(resultado));
      return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
		}
		catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		finally {
      try { if (connection != null) connection.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
		}
	}
	
	@RequestMapping(
			value = "/campus", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> getCityCampus(@RequestParam("ciudad") String ciudad)
	{
		logger.info("Service: getCityCampus()");
		Connection connection = null;
		PreparedStatement preparedStmt = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"ID\" , \"CAMPUS\" FROM \"TB_CODIGOS_DE_CAMPUS\" ";
			query += "WHERE \"CIUDAD\" = ? ORDER BY \"CAMPUS\" ASC";

			System.out.println(query);

			List<Campus> campus = new ArrayList<Campus>();
		
			preparedStmt = connection.prepareStatement(query);
			preparedStmt.setInt(1, Integer.parseInt(ciudad));
			ResultSet res = preparedStmt.executeQuery();

			while (res.next()){
				campus.add(new Campus(res.getInt("ID"),res.getString("CAMPUS")));
			}

			System.out.println("Campus result: "+gson.toJson(campus));
      return new ResponseEntity<>(gson.toJson(campus), HttpStatus.OK);
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
	
	@RequestMapping(
			value = "/edificio", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> getCampusBuildings(@RequestParam("campus") String campus)
	{
		logger.info("Service: getCampusBuildings()");
		Connection connection = null;
		PreparedStatement  preparedStmt = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"id_edificio\" , \"edificio\", \"direccion\" ";
			query += "FROM \"tb_edificios\" WHERE \"campus\" = ? ORDER BY \"edificio\" ASC";

			System.out.println(query);

			List<Edificio> buildings = new ArrayList<Edificio>();
		
			preparedStmt = connection.prepareStatement(query);
			preparedStmt.setInt(1, Integer.parseInt(campus));
			ResultSet res = preparedStmt.executeQuery();

			while (res.next()){
				String idEdificio= res.getString("id_edificio");
				List<String> buildingFloors = getBuildingFloors(connection,idEdificio);
				buildings.add(new Edificio(idEdificio,res.getString("edificio"),res.getString("direccion"),buildingFloors));
			}

			System.out.println("Buildings result"+gson.toJson(buildings));
      return new ResponseEntity<>(gson.toJson(buildings), HttpStatus.OK);
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
	
	@RequestMapping(
			value = "/infoEdificio", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> getBuildingInfo(@RequestParam("id") String id)
	{
		logger.info("Service: getBuildingInfo()");
		Connection connection = null;
		PreparedStatement preparedStmt = null;
		try {
			connection = ConnectionManager.getConnection();
			Gson gson = new Gson();

			String query = "SELECT DISTINCT \"id_edificio\" , \"edificio\", \"direccion\" ";
			query += "FROM \"tb_edificios\" WHERE \"id_edificio\" = ?";

			System.out.println(query);

			List<Edificio> result = new ArrayList<Edificio>();
		
			preparedStmt = connection.prepareStatement(query);
			preparedStmt.setString(1, id);
			ResultSet res = preparedStmt.executeQuery();

			while (res.next()){
				String idEdificio= res.getString("id_edificio");
				List<String> buildingFloors = getBuildingFloors(connection,idEdificio);
				result.add(new Edificio(idEdificio,res.getString("edificio"),res.getString("direccion"),buildingFloors));
			}

			System.out.println("Building info result: "+gson.toJson(result));
      return new ResponseEntity<>(gson.toJson(result), HttpStatus.OK);
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
	
	private static List<String> getBuildingFloors(Connection connection,String idEdificio)
	{
		List<String> buildingFloors = new ArrayList<String>();
		PreparedStatement preparedStmt = null;
		try {
			String query = "SELECT DISTINCT SUBSTRING(\"id_utc\",1,2) AS \"floors\" ";
			query += "FROM \"tb_espacios\" WHERE \"id_edificio\" = ? ORDER BY \"floors\" ASC";
		
			preparedStmt = connection.prepareStatement(query);
			preparedStmt.setString(1, idEdificio);
			ResultSet res = preparedStmt.executeQuery();

			while (res.next()){
				buildingFloors.add(res.getString("floors"));
			}
		}
		catch (SQLException e) {
        e.printStackTrace();
		}
		finally {
			try { if (preparedStmt != null) preparedStmt.close(); }
      catch (Exception excep) { excep.printStackTrace(); }
		}
		return buildingFloors;
	}
}
