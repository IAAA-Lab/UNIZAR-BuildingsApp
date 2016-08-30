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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/estancias")
public class EstanciasRestController {
	
	private static final Logger logger = LoggerFactory.getLogger(EstanciasRestController.class);
	
	@RequestMapping(
			value = "/id_estancia", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> infoEstancia(@RequestParam("estancia") String estancia)
	{
		logger.info("Servicio: id_estancia()");
		Connection connection = ConnectionManager.getConnection();
		
		Gson gson = new Gson();
		Espacios resultado = null;

		try {
			String querySelect = "SELECT DISTINCT \"TBES\".\"ID_ESPACIO\", \"TBES\".\"ID_CENTRO\", ";
			querySelect += "\"TBED\".\"EDIFICIO\" AS \"edificio\", \"TBED\".\"DIRECCION\" AS \"dir\", ";
			querySelect += "\"TBCI\".\"CIUDADES\" AS \"ciudad\", \"TBCC\".\"CAMPUS\" AS \"campus\" ";

			String queryFrom = "FROM \"TB_ESPACIOS\" \"TBES\", \"TB_CIUDADES\" \"TBCI\", ";
			queryFrom += "\"TB_EDIFICIOS\" \"TBED\", \"TB_CODIGOS_DE_CAMPUS\" \"TBCC\" ";

			String queryWhere = "WHERE \"TBES\".\"ID_ESPACIO\" = '"+estancia+"' AND \"TBES\".\"ID_EDIFICIO\"=\"TBED\".\"ID_EDIFICIO\" ";
			queryWhere +=  "AND \"TBED\".\"CAMPUS\"=\"TBCC\".\"ID\" AND \"TBCC\".\"CIUDAD\"=\"TBCI\".\"ID\"";

			String query = querySelect + queryFrom + queryWhere;
		
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			if (respuesta.next()){
				resultado = new Espacios(
												respuesta.getString("ID_ESPACIO"),
												respuesta.getString("ID_CENTRO"),
												respuesta.getString("edificio"),
												respuesta.getString("dir"),
												respuesta.getString("ciudad"),
												respuesta.getString("campus"));
			}

			System.out.println("resultado"+gson.toJson(resultado));
			connection.close();
			return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
			
		} catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(
			value = "/getEstancia", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> getEstancia(@RequestParam("estancia") String estancia)
	{
		logger.info("Servicio: getEstancia()");

		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();

		try {
			String query = "SELECT DISTINCT \"A\".\"ID_ESPACIO\" ,\"A\".\"ID_CENTRO\", \"B\".\"TIPO_DE_USO\", round(\"A\".\"SUPERFICIE\",2) AS \"SUPERFICIE\" ";
			query += "FROM \"TB_ESPACIOS\" \"A\",\"TB_TIPO_DE_USO\" \"B\"  ";
			query += "WHERE \"A\".\"TIPO_DE_USO\" = \"B\".ID AND \"A\".\"ID_ESPACIO\" = '"+estancia+"'";

			Espacios resultado;
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			if (respuesta.next()){
				resultado=new Espacios(respuesta.getString("ID_ESPACIO"),respuesta.getString("ID_CENTRO"),respuesta.getString("TIPO_DE_USO"),respuesta.getString("SUPERFICIE"));
				System.out.println("resultado"+gson.toJson(resultado));
				connection.close();
      	return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
			}
			else {
				connection.close();
				return new ResponseEntity<>("", HttpStatus.OK);
			}
			
		} catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(
			value = "/getAllEstancias", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> getAllEstancias(@RequestParam("estancia") String espacio)
	{
		logger.info("Servicio: getAllEstancias()");

		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();

		try {
			String query = "SELECT DISTINCT \"ID_ESPACIO\" ,\"ID_CENTRO\" ";
			query += "FROM \"TB_ESPACIOS\" ";
			query += "WHERE \"ID_ESPACIO\" LIKE \'"+espacio+"%\' ORDER BY \"ID_CENTRO\" ASC";

			List<Espacios> resultado = new ArrayList<Espacios>();
		
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Espacios(respuesta.getString("ID_ESPACIO"),respuesta.getString("ID_CENTRO")));
			}
			
			connection.close();
      return new ResponseEntity<>(gson.toJson(resultado), HttpStatus.OK);
		} 
		catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(
			value = "/campus", 
			method = RequestMethod.GET,
			produces = "application/json")
	public ResponseEntity<?> getCampusValues()
	{
		logger.info("Servicio: getCampusValues()");

		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();

		try {
			String query = "SELECT \"CAMPUS\" FROM \"TB_CODIGOS_DE_CAMPUS\"";

			System.out.println(query);

			List<String> result = new ArrayList<String>();

			ResultSet res = connection.prepareStatement(query).executeQuery();
			while (res.next()){
				result.add(res.getString("CAMPUS"));
			}
			
			connection.close();
      return new ResponseEntity<>(gson.toJson(result), HttpStatus.OK);
		}
		catch (SQLException e) {
        e.printStackTrace();
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
