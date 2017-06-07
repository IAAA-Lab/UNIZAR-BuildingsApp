package com.uzapp.bd;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Users {

	public static String getUsername() {

		String respuesta = "";

		// Access db to obtain user info
		Connection connection = null;
		PreparedStatement preparedStmt = null;

		try {
            connection = ConnectionManager.getConnection();

            String query = "SELECT username FROM users";
            preparedStmt = connection.prepareStatement(query);
            ResultSet rs = preparedStmt.executeQuery();

            if (rs.next()) {
            	respuesta = rs.getString(1);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

		return respuesta;
	}

	public static String getRole(String username) {

		String respuesta = "";

		// Access db to obtain user info
		Connection connection = null;
		PreparedStatement preparedStmt = null;

		try {
            connection = ConnectionManager.getConnection();

            String query = "SELECT role FROM users WHERE username = '" + username + "'";
            preparedStmt = connection.prepareStatement(query);
            ResultSet rs = preparedStmt.executeQuery();

            if (rs.next()) {
            	respuesta = rs.getString(1);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

		return respuesta;
	}
}
