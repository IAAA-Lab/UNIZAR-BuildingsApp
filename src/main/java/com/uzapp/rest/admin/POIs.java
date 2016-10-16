package com.uzapp.rest.admin;

import com.uzapp.dominio.POI;
import com.uzapp.dominio.POIRequest;

import com.uzapp.bd.ConnectionManager;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/pois")
public class POIs {
    private static final Logger logger = LoggerFactory.getLogger(POI.class);

    /**
    * Returns POI object from query result
    */
    private ResponseEntity<?> setPOIdata(ResultSet rs) {
        try {
            POI poi = null;
            Gson gson = new Gson();
            if(rs.next()) {
                poi = new POI(
                        rs.getInt("id"),
                        rs.getString("ciudad"),
                        rs.getString("campus"),
                        rs.getString("edificio"),
                        rs.getString("estancia_id"),
                        rs.getString("estancia_nombre"),
                        rs.getString("planta"),
                        rs.getString("categoria"),
                        rs.getString("comment"),
                        rs.getString("dir"),
                        rs.getDouble("lat"),
                        rs.getDouble("lng"),
                        rs.getBoolean("approved"),
                        rs.getString("email"),
                        rs.getTimestamp("updated").toLocalDateTime());
            }
            return new ResponseEntity<>("{\"data\":"+gson.toJson(poi)+"}", HttpStatus.OK);

        } catch (SQLException e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
    * Get POI by ID
    */
    private ResponseEntity<?> getPOI(Connection connection, int id){
        logger.info("Method getPOI", id);
        PreparedStatement preparedStmt = null;
        try {
            String query = "";
            query = "SELECT * FROM pois WHERE id=?";
            preparedStmt = connection.prepareStatement(query);
            preparedStmt.setInt(1, id);

            ResultSet rs = preparedStmt.executeQuery();
            ResponseEntity<?> response = setPOIdata(rs);

            return response;

        } catch (SQLException e) {
            e.printStackTrace();
			if (connection != null) {
                try { connection.close(); }
                catch(SQLException excep) { excep.printStackTrace(); }
            }
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
    * API: Get all POI
    */
    @RequestMapping(
            value = "/", 
            method = RequestMethod.GET,
            produces = "application/json")
    public ResponseEntity<?> getAllPOIs()
    {
        logger.info("Service: getAllPOIs()");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            Gson gson = new Gson();
            connection = ConnectionManager.getConnection();

            String query = "SELECT * FROM pois";
            preparedStmt = connection.prepareStatement(query);

            ResultSet rs = preparedStmt.executeQuery();
            List<POI> result = new ArrayList<POI>();
            while (rs.next()){
                result.add(new POI(
                        rs.getInt("id"),
                        rs.getString("ciudad"),
                        rs.getString("campus"),
                        rs.getString("edificio"),
                        rs.getString("estancia_id"),
                        rs.getString("estancia_nombre"),
                        rs.getString("planta"),
                        rs.getString("categoria"),
                        rs.getString("comment"),
                        rs.getString("dir"),
                        rs.getDouble("lat"),
                        rs.getDouble("lng"),
                        rs.getBoolean("approved"),
                        rs.getString("email"),
                        rs.getTimestamp("updated").toLocalDateTime()));
            }
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

    /**
    * API: Get POI by {id}
    */
    @RequestMapping(
            value = "/{id}",
            method = RequestMethod.GET,
            produces = "application/json")
    public ResponseEntity<?> getInfoPOI(@PathVariable("id") int id)
    {
        logger.info("Service: getInfoPOI()");
        Connection connection = ConnectionManager.getConnection();
        ResponseEntity<?> result = getPOI(connection, id);
        return result;
    }

    /**
    * API: Get all POI by {building} and {floor}
    */
    @RequestMapping(
            value = "/{building}/{floor}", 
            method = RequestMethod.GET,
            produces = "application/json")
    public ResponseEntity<?> getFloorPOIS(
        @PathVariable("building") String building, 
        @PathVariable("floor") String floor)
    {
        logger.info("Service: getFloorPOIS()");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            Gson gson = new Gson();
            connection = ConnectionManager.getConnection();

            String query = "SELECT * FROM pois WHERE estancia_id LIKE \'"+building+"%\' AND planta=\'"+floor+"\' AND approved=true";
            System.out.println("Query: " + query);
            preparedStmt = connection.prepareStatement(query);

            ResultSet rs = preparedStmt.executeQuery();
            List<POI> result = new ArrayList<POI>();
            while (rs.next()){
                result.add(new POI(
                        rs.getInt("id"),
                        rs.getString("ciudad"),
                        rs.getString("campus"),
                        rs.getString("edificio"),
                        rs.getString("estancia_id"),
                        rs.getString("estancia_nombre"),
                        rs.getString("planta"),
                        rs.getString("categoria"),
                        rs.getString("comment"),
                        rs.getString("dir"),
                        rs.getDouble("lat"),
                        rs.getDouble("lng"),
                        rs.getString("email")));
            }
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

    /**
    * API: Create a request for create a POI
    */
    @RequestMapping(
            value = "/",
            method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody POI poi)
    {
        logger.info("Service: create poi");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            Gson gson = new Gson();
            connection = ConnectionManager.getConnection();

            String query = "INSERT INTO pois(ciudad,campus,edificio,estancia_id,estancia_nombre,planta,categoria,comment,dir,lat,lng,approved,email,updated) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            preparedStmt = connection.prepareStatement(query);

            preparedStmt.setString(1, poi.getCity());
            preparedStmt.setString(2, poi.getCampus());
            preparedStmt.setString(3, poi.getBuilding());
            preparedStmt.setString(4, poi.getRoomId());
            preparedStmt.setString(5, poi.getRoomName());
            preparedStmt.setString(6, poi.getFloor());
            preparedStmt.setString(7, poi.getCategory());
            preparedStmt.setString(8, poi.getComments());
            preparedStmt.setString(9, poi.getAddress());
            preparedStmt.setDouble(10, poi.getLatitude());
            preparedStmt.setDouble(11, poi.getLongitude());
            preparedStmt.setBoolean(12, false);
            preparedStmt.setString(13, poi.getEmail());
            preparedStmt.setTimestamp(14, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            int rowsInserted =preparedStmt.executeUpdate();

            if (rowsInserted > 0) {
                return new ResponseEntity<>(gson.toJson(poi), HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("Error creating POI", HttpStatus.INTERNAL_SERVER_ERROR);
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
    * API: Update POI data
    */
    @RequestMapping(
            value = "/",
            method = RequestMethod.PUT)
    public ResponseEntity<?> update(@RequestBody POI poi){
        logger.info("Service: update poi");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            connection = ConnectionManager.getConnection();

            String query = "UPDATE pois ";
            query += "SET  ciudad=?, campus=?, edificio=?, planta=?, categoria=?, comment=?, dir=?, approved=?, updated=?";
            query += "WHERE id=?";
            preparedStmt = connection.prepareStatement(query);

            preparedStmt.setString(1, poi.getCity());
            preparedStmt.setString(2, poi.getCampus());
            preparedStmt.setString(3, poi.getBuilding());
            preparedStmt.setString(4, poi.getFloor());
            preparedStmt.setString(5, poi.getCategory());
            preparedStmt.setString(6, poi.getComments());
            preparedStmt.setString(7, poi.getAddress());
            preparedStmt.setBoolean(8, poi.getApproved());
            preparedStmt.setTimestamp(9, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            preparedStmt.setInt(10, poi.getId());
            int rowsInserted =preparedStmt.executeUpdate();

            if (rowsInserted > 0) {
                ResponseEntity<?> result = getPOI(connection, poi.getId());
                return result;
            }
            else {
                return new ResponseEntity<>("Error updating POI", HttpStatus.INTERNAL_SERVER_ERROR);
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
    * API: Delete POI by {id}
    */
    @RequestMapping(
            value = "/{id}",
            method = RequestMethod.DELETE)
    public ResponseEntity<?> deletePOI(@PathVariable("id") int id)
    {
        logger.info("Service: deletePOI");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            connection = ConnectionManager.getConnection();

            String query = "DELETE FROM pois WHERE id=?";
            preparedStmt = connection.prepareStatement(query);

            preparedStmt.setInt(1, id);
            int rowsDeleted =preparedStmt.executeUpdate();

            if (rowsDeleted > 0) {
                query = "DELETE FROM request WHERE poi=?";
                preparedStmt = connection.prepareStatement(query);
                preparedStmt.setInt(1, id);
                rowsDeleted =preparedStmt.executeUpdate();
                return new ResponseEntity<>("Success deleting POI with id " +  id, HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("Error deleting POI", HttpStatus.INTERNAL_SERVER_ERROR);
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
    * API: Get all pending POI requests
    */
    @RequestMapping(
            value = "/request/pending", 
            method = RequestMethod.GET,
            produces = "application/json")
    public ResponseEntity<?> getAllPendingPOIRequests()
    {
        logger.info("Service: getAllPendingPOIRequests()");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            Gson gson = new Gson();
            connection = ConnectionManager.getConnection();

            String query = "SELECT r.*, p.ciudad, p.campus, p.edificio, p.estancia_nombre, p.planta, p.categoria as categoria_poi, p.comment as comment_poi ";
            query += "FROM request AS r INNER JOIN pois AS p ON r.poi=p.id WHERE r.status='pending'";
            preparedStmt = connection.prepareStatement(query);

            ResultSet rs = preparedStmt.executeQuery();
            List<POIRequest> result = new ArrayList<POIRequest>();
            while (rs.next()){
                //If is an {edit} request, get edited category and comment
                if (rs.getString("type").equals("edit")) {
                    result.add(new POIRequest(
                        rs.getInt("id"),
                        rs.getString("type"),
                        rs.getInt("poi"),
                        rs.getString("category"),
                        rs.getString("comment"),
                        rs.getString("reason"),
                        rs.getString("email"),
                        rs.getString("status"),
                        rs.getString("ciudad"),
                        rs.getString("campus"),
                        rs.getString("edificio"),
                        rs.getString("estancia_nombre"),
                        rs.getString("planta"),
                        rs.getTimestamp("request_date").toLocalDateTime(),
                        rs.getTimestamp("action_date").toLocalDateTime()));
                }
                //If es an {delete} request, get original category and comment
                else {
                    result.add(new POIRequest(
                        rs.getInt("id"),
                        rs.getString("type"),
                        rs.getInt("poi"),
                        rs.getString("categoria_poi"),
                        rs.getString("comment_poi"),
                        rs.getString("reason"),
                        rs.getString("email"),
                        rs.getString("status"),
                        rs.getString("ciudad"),
                        rs.getString("campus"),
                        rs.getString("edificio"),
                        rs.getString("estancia_nombre"),
                        rs.getString("planta"),
                        rs.getTimestamp("request_date").toLocalDateTime(),
                        rs.getTimestamp("action_date").toLocalDateTime()));
                }
            }
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

    /**
    * API: Create a request for modify or delete a POI
    */
    @RequestMapping(
            value = "/request",
            method = RequestMethod.POST)
    public ResponseEntity<?> request(@RequestBody POIRequest poiRequest)
    {
        logger.info("Service: request");
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try {
            Gson gson = new Gson();
            connection = ConnectionManager.getConnection();

            String query = "INSERT INTO request(type,poi,category,comment,reason,status,email,request_date,action_date) values (?,?,?,?,?,?,?,?,?)";
            preparedStmt = connection.prepareStatement(query);

            preparedStmt.setString(1, poiRequest.getType());
            preparedStmt.setInt(2, poiRequest.getPOI());
            preparedStmt.setString(3, poiRequest.getCategory());
            preparedStmt.setString(4, poiRequest.getComment());
            preparedStmt.setString(5, poiRequest.getReason());
            preparedStmt.setString(6, "pending");
            preparedStmt.setString(7, poiRequest.getEmail());
            preparedStmt.setTimestamp(8, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            preparedStmt.setTimestamp(9, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            int rowsInserted =preparedStmt.executeUpdate();

            if (rowsInserted > 0) {
                return new ResponseEntity<>(gson.toJson(poiRequest), HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("Error creating POI request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    * Create a POI edition Request object
    */
    private POIRequest getPOIRequestEditionData(ResultSet rs) throws SQLException {
        POIRequest poiRequest = null;
        try {
            if(rs.next()) {
                poiRequest = new POIRequest(
                        rs.getInt("id"),
                        rs.getString("type"),
                        rs.getInt("poi"),
                        rs.getString("category"),
                        rs.getString("comment"),
                        rs.getString("status"),
                        rs.getString("email"),
                        rs.getTimestamp("request_date").toLocalDateTime(),
                        rs.getTimestamp("action_date").toLocalDateTime());
            }
            return poiRequest;
        } 
        catch (SQLException e) {
            e.printStackTrace();
            throw new SQLException(e);
        }
    }

    /**
    * Approve a request for edit a POI
    */
    private ResponseEntity<?> approveEditionRequest(int id) {
        logger.info("Service: approveEditionRequest()");

        Connection connection = null;
        PreparedStatement preparedStmtSelect = null;
        PreparedStatement preparedStmtUpdatePOI = null;
        PreparedStatement preparedStmtUpdateRequest = null;
        String error = null;

        try {
            connection = ConnectionManager.getConnection();
            //Recover request data
            String querySelect = "SELECT * FROM request WHERE id=?";
            preparedStmtSelect = connection.prepareStatement(querySelect);

            preparedStmtSelect.setInt(1, id);
            ResultSet rs = preparedStmtSelect.executeQuery();

            POIRequest poiRequest = getPOIRequestEditionData(rs);

            connection.setAutoCommit(false);

            //Update related poi to request
            String queryUpdatePois = "UPDATE pois SET comment=?, categoria=?, updated=? WHERE id=?";
            preparedStmtUpdatePOI = connection.prepareStatement(queryUpdatePois);
            preparedStmtUpdatePOI.setString(1, poiRequest.getComment());
            preparedStmtUpdatePOI.setString(2, poiRequest.getCategory());
            preparedStmtUpdatePOI.setTimestamp(3, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            preparedStmtUpdatePOI.setInt(4, poiRequest.getPOI());
            
            //Update status of the request
            String queryUpdateRequest = "UPDATE request SET status='approved', action_date=? WHERE id=?";
            preparedStmtUpdateRequest = connection.prepareStatement(queryUpdateRequest);
            preparedStmtUpdateRequest.setTimestamp(1, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            preparedStmtUpdateRequest.setInt(2, id);

            //Execute queries
            preparedStmtUpdatePOI.executeUpdate();
            preparedStmtUpdateRequest.executeUpdate();
            connection.commit();

        } catch (SQLException e) {
            e.printStackTrace();
            if (connection != null) {
                try {
                    System.err.print("Transaction is being rolled back");
                    connection.rollback();
                    error = e.getMessage();
                } catch(SQLException excep) {
                    error = excep.getMessage();
                }
            }
        } finally {
            try {
                if (preparedStmtUpdatePOI != null) {
                    preparedStmtUpdatePOI.close();
                }
                if (preparedStmtUpdateRequest != null) {
                    preparedStmtUpdateRequest.close();
                }
                connection.setAutoCommit(true);
            }
            catch (SQLException e) {
                System.err.print("Error closing connections");

            } finally {
                System.err.print("Error: " + error);
                if (error == null) {
                    return new ResponseEntity<>("Success approving POI edition request with id: "+id, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }

    /**
    * Create a delete POI Request object
    */
    private POIRequest getPOIRequestDeleteData(ResultSet rs) throws SQLException {
        POIRequest poiRequest = null;
        try {
            if(rs.next()) {
                poiRequest = new POIRequest(
                        rs.getInt("id"),
                        rs.getString("type"),
                        rs.getInt("poi"),
                        rs.getString("status"),
                        rs.getString("email"),
                        rs.getString("reason"),
                        rs.getTimestamp("request_date").toLocalDateTime(),
                        rs.getTimestamp("action_date").toLocalDateTime());
            }
            return poiRequest;
        } 
        catch (SQLException e) {
            e.printStackTrace();
            throw new SQLException(e);
        }
    }

    /**
    * Approve a request for deleting a POI
    */
    private ResponseEntity<?> approveDeleteRequest(int id) {
        logger.info("Service: approveDeleteRequest()");
        
        Connection connection = null;
        PreparedStatement preparedStmtSelect = null;
        PreparedStatement preparedStmtDelete = null;
        PreparedStatement preparedStmtUpdate = null;
        String error = null;

        try {
            connection = ConnectionManager.getConnection();
            //Recover request data
            String querySelect = "SELECT * FROM request WHERE id=?";
            preparedStmtSelect = connection.prepareStatement(querySelect);
            preparedStmtSelect.setInt(1, id);
            ResultSet rs = preparedStmtSelect.executeQuery();

            POIRequest poiRequest = getPOIRequestDeleteData(rs);

            connection.setAutoCommit(false);

            //Delete related poi to request
            String queryDelete = "DELETE FROM pois WHERE id=?";
            preparedStmtDelete = connection.prepareStatement(queryDelete);
            preparedStmtDelete.setInt(1, poiRequest.getPOI());

            //Update status of the request
            String queryUpdate = "UPDATE request SET status='approved', action_date=? WHERE id=?";
            preparedStmtUpdate = connection.prepareStatement(queryUpdate);
            preparedStmtUpdate.setTimestamp(1, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            preparedStmtUpdate.setInt(2, id);

            //Execute queries
            preparedStmtDelete.executeUpdate();
            preparedStmtUpdate.executeUpdate();
            connection.commit(); 

        } catch (SQLException e) {
            e.printStackTrace();
            if (connection != null) {
                try {
                    System.err.print("Transaction is being rolled back");
                    connection.rollback();
                    error = e.getMessage();
                } catch(SQLException excep) {
                    error = excep.getMessage();
                }
            }
        } finally {
            try {
                if (preparedStmtDelete != null) {
                    preparedStmtDelete.close();
                }
                if (preparedStmtUpdate != null) {
                    preparedStmtUpdate.close();
                }
                connection.setAutoCommit(true);
            }
            catch (SQLException e) {
                System.err.print("Error closing connections");

            } finally {
                if (error == null) {
                    return new ResponseEntity<>("Success approving POI edition request with id: "+id, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }

    /**
    * Reject an edition/delete Request
    */
    private ResponseEntity<?> rejectRequest(int id) {
        Connection connection = null;
        PreparedStatement preparedStmt = null;
        try
        {
            logger.info("Service: rejectRequest()");
            connection = ConnectionManager.getConnection();

            String query = "UPDATE request SET status='rejected', action_date=? WHERE id=?";
            preparedStmt = connection.prepareStatement(query);

            preparedStmt.setTimestamp(1, Timestamp.from(LocalDateTime.now().toInstant(ZoneOffset.ofHours(2))));
            preparedStmt.setInt(2, id);
            int rowsInserted =preparedStmt.executeUpdate();

            connection.close();
            if (rowsInserted > 0) {
                return new ResponseEntity<>("Success rejecting POI request with id: "+id, HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("Error rejecting POI request", HttpStatus.INTERNAL_SERVER_ERROR);
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
     * API: Approve or reject a request for edit/delete a POI
     */
    @RequestMapping(
            value = "/request/{requestId}/{verb}/{action}",
            method = RequestMethod.PUT)
    public ResponseEntity<?> approveOrRejectRequest(
        @PathVariable("requestId") int requestId, 
        @PathVariable("verb") String verb,
        @PathVariable("action") String action)
    {
        logger.info("Service: approveOrRejectRequest()");
        ResponseEntity<?> result = null;
        switch (verb) {
            case "approve": {
                switch (action) {
                    case "edit":
                        result = approveEditionRequest(requestId);
                        return result;
                    case "delete":
                        result = approveDeleteRequest(requestId);
                        return result;
                    default:
                        return new ResponseEntity<>("Error creating POI request", HttpStatus.METHOD_NOT_ALLOWED);
                }
            }
            case "reject":{
                switch (action) {
                    case "edit":
                    case "delete":
                        result = rejectRequest(requestId);
                        return result;
                    default:
                        return new ResponseEntity<>("Error creating POI request", HttpStatus.METHOD_NOT_ALLOWED);
                }
            }
            default:
                return new ResponseEntity<>("Error creating POI request", HttpStatus.METHOD_NOT_ALLOWED);
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
