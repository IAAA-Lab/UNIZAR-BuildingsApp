package com.uzapp.rest.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Properties;
import java.lang.Runtime;
import java.lang.Process;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import java.io.*;

import com.uzapp.bd.ConnectionManager;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/database")
public class Database {

    private static final Logger logger = LoggerFactory.getLogger(Database.class);

    // Database connection vars
    private static String db_host_orig = "";
    private static String db_name_orig = "";
    private static String db_user_orig = "";
    private static String db_pwd_orig =  "";
    private static String db_host_dest = "";
    private static String db_name_dest = "";
    private static String db_user_dest = "";
    private static String db_pwd_dest = "";
    private static String script = "";

    // Initalize database connection vars from config properties file
    static {
        try {
            InputStream input = Database.class.getClassLoader().getResourceAsStream("config.properties");
            Properties prop = new Properties();
            prop.load(input);
            db_host_orig = prop.getProperty("dbhost_sigeuz");
            db_name_orig = prop.getProperty("db_sigeuz");
            db_user_orig = prop.getProperty("dbuser_sigeuz");
            db_pwd_orig = prop.getProperty("dbpassword_sigeuz");
            db_host_dest = prop.getProperty("dbhost");
            db_name_dest = prop.getProperty("db");
            db_user_dest = prop.getProperty("dbsuperuser");
            db_pwd_dest = prop.getProperty("dbsuperuser_password");
            script = prop.getProperty("script_update_database");
        }
        catch (IOException e) {
            e.printStackTrace(System.err);
        }
    }

    /**
     * Returns all the database tables
    */
    @RequestMapping(
            value = "/tables",
            method = RequestMethod.GET)
    public ResponseEntity<?> getDatabaseTables(){
        logger.info("Servicio: getDatabaseTables");
        Gson gson = new Gson();
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            connection = ConnectionManager.getConnection();

            String query = "SELECT table_name FROM information_schema.tables ";
            query += "WHERE table_schema='public' AND table_name NOT LIKE 'csf_%' ";
            query += "ORDER BY table_name";
            preparedStmt = connection.prepareStatement(query);
            ResultSet rs = preparedStmt.executeQuery();

            List<String> database_tables = new ArrayList<String>();

            while(rs.next()) {
                database_tables.add(rs.getString("table_name"));
            }

            return new ResponseEntity<>(gson.toJson(database_tables), HttpStatus.OK);
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
     * Updates database
    */
    @RequestMapping(
            value = "/update",
            method = RequestMethod.PUT)
    public ResponseEntity<?> update(@RequestBody String tables){
        logger.info("Servicio: update database");
        String result = null;
        try
        {
            String[] cmd = {"bash", script, db_host_orig, db_name_orig, db_user_orig, db_pwd_orig, db_host_dest, db_name_dest, db_user_dest, db_pwd_dest, tables};

            Runtime r = Runtime.getRuntime();                    

            System.out.println("Command: " + String.join(" ", cmd));

            Process process = r.exec(String.join(" ", cmd));
            int exitValue = process.waitFor();

            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "Un error ha ocurrido durante el proceso de actualización. Por favor, revise ";
            message += "inmediatamente el funcionamiento de la aplicación o comunique con un administrador del sistema";

            switch (exitValue) {
                case 0:
                    status = HttpStatus.OK;
                    message = "Actualización completada con éxito";
                    break;
                case 126:
                    message = "Error de permisos de ejecución o comando no ejecutable al realizar la actualización.\n" + message;
                    break;
                case 127:
                    message = "Error al ejectuar el comando de actualización de los datos.\n" + message;
                    break;
                case 130:
                    message = "Error, el proceso de actualización ha sido interrumpido (Ctrl + C).\n" + message;
                    break;
                default:
                    break;
            }
            
            return new ResponseEntity<>(message, status);
        }
        catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(
            value = "/**",
            method = RequestMethod.OPTIONS
    )
    public ResponseEntity handle() {
        return new ResponseEntity(HttpStatus.OK);
    }
}
