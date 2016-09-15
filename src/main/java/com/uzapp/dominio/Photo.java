package com.uzapp.dominio;

import java.time.LocalDateTime;

public class Photo {

    private int id;
    private LocalDateTime created;
    private String name;
    private String city;
    private String campus;
    private String building;
    private String roomId;
    private String roomName;
    private String floor;
    private String status;
    private String email;
    private String reason;
    private LocalDateTime updated;

    public Photo() {}

    public Photo(int id, LocalDateTime created, String name, String city, String campus, String building, 
                String roomId, String roomName, String floor, String status, String email, LocalDateTime updated){
        this.id=id;
        this.created=created;
        this.name=name;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.status=status;
        this.email=email;
        this.updated=updated;
    }
    
    public Photo(int id, String name, String city, String campus, String building, String floor,
                String roomId, String roomName, String status, String email, String reason, LocalDateTime updated){
        this.id=id;
        this.name=name;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.status=status;
        this.email=email;
        this.updated=updated;
        this.reason=reason;
    }

    public Photo(LocalDateTime created, String name, String city, String campus, String building, 
                String roomId, String roomName, String floor, String status, String email){
        this.created=created;
        this.name=name;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.status=status;
        this.email=email;
    }

    public Photo(LocalDateTime created, String name, String city, String campus, 
                String building, String roomId, String roomName, String floor, String status){
        this.created=created;
        this.name=name;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.status=status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public LocalDateTime getCreated() { return this.created; }
    public void setCreated(LocalDateTime created) { this.created = created; }

    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return this.city; }
    public void setCity(String city) { this.city = city; }

    public String getCampus() { return this.campus; }
    public void setCampus(String campus) { this.campus = campus; }

    public String getBuilding() { return this.building; }
    public void setBuilding(String building) { this.building = building; }

    public String getRoomId() { return this.roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getRoomName() { return this.roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getFloor() { return this.floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getStatus() { return this.status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }

    public String getReason() { return this.reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getUpdated() { return this.updated; }
    public void setUpdated(LocalDateTime updated) { this.updated = updated; }
}