package com.uzapp.rest.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Properties;
import java.lang.Runtime;
import java.lang.Process;
import java.io.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/database")
public class Database {

    private static final Logger logger = LoggerFactory.getLogger(Database.class);

    @RequestMapping(
            value = "/update",
            method = RequestMethod.PUT)
    public ResponseEntity<?> update(){
        logger.info("Servicio: update database");
        String result = null;
        try {
            
            InputStream input = Database.class.getClassLoader().getResourceAsStream("config.properties");
            Properties prop = new Properties();
            prop.load(input);

            String db_host_orig = prop.getProperty("dbhost_sigeuz");
            String db_name_orig = prop.getProperty("db_sigeuz");
            String db_user_orig = prop.getProperty("dbuser_sigeuz");
            String db_pwd_orig = prop.getProperty("dbpassword_sigeuz");

            String db_host_dest = prop.getProperty("dbhost");
            String db_name_dest = prop.getProperty("db");
            String db_user_dest = prop.getProperty("dbsuperuser");
            String db_pwd_dest = prop.getProperty("dbsuperuser_password");

            String script = "/tmp/scripts/database/update_db.sh";

            String[] cmd = {"bash", script, db_host_orig, db_name_orig, db_user_orig, db_pwd_orig, db_host_dest, db_name_dest, db_user_dest, db_pwd_dest};

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
