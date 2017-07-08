package com.uzapp;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class MyServletContextListener
               implements ServletContextListener{

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("ServletContextListener destroyed");

		Enumeration<java .sql.Driver> drivers = java.sql.DriverManager.getDrivers();
		while (drivers.hasMoreElements()) {
		    java.sql.Driver driver = drivers.nextElement();
		    try {
		       java.sql.DriverManager.deregisterDriver(driver);
		    } catch (Exception e) {
		        //log exception or ignore
		    }
		}

	}

        //Run this before web application is started
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("ServletContextListener started");
	}
}
