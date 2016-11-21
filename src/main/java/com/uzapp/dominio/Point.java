package com.uzapp.dominio;

public class Point {

	private double x;
	private double y;
	String buildingName;

	public Point(double x, double y, String buildingName){
		this.x = x;
		this.y = y;
		this.buildingName = buildingName;
	}

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public String getBuildingName() {
		return buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}
}
