package com.uzapp.dominio;
import java.time.LocalDateTime;

public class POIRequest {

    private int id;
    private String type;
    private int poi;
    private String category;
    private String comment;
    private String status;
    private String reason;
    private String email;

    private String city;
    private String campus;
    private String building;
    private String room;
    private int floor;

    private LocalDateTime requestDate;
    private LocalDateTime actionDate;

    public POIRequest() {}

    public POIRequest(int id, String type, int poi, String category, String comment, String status, 
        String email, LocalDateTime requestDate, LocalDateTime actionDate){
        this.id=id;
        this.type=type;
        this.poi=poi;
        this.category=category;
        this.comment=comment;
        this.status=status;
        this.email=email;
        this.requestDate=requestDate;
        this.actionDate=actionDate;
    }

    public POIRequest(String type, int poi, String category, String comment, String reason, String status, String email){
        this.type=type;
        this.poi=poi;
        this.category=category;
        this.comment=comment;
        this.reason=reason;
        this.status=status;
        this.email=email;
    }

    public POIRequest(String type, int poi, String category, String comment, String email){
        this.type=type;
        this.poi=poi;
        this.category=category;
        this.comment=comment;
        this.email=email;
    }

    public POIRequest(int id, String type, int poi, String status, String email,
        String reason, LocalDateTime requestDate, LocalDateTime actionDate){
        this.id=id;
        this.type=type;
        this.poi=poi;
        this.status=status;
        this.email=email;
        this.reason=reason;
        this.requestDate=requestDate;
        this.actionDate=actionDate;
    }

    public POIRequest(int id, String type, int poi, String category, String comment, String reason, String email, 
        String status, String city, String campus, String building, String room, int floor, LocalDateTime requestDate, LocalDateTime actionDate){
        this.id=id;
        this.type=type;
        this.poi=poi;
        this.category=category;
        this.comment=comment;
        this.reason=reason;
        this.email=email;
        this.status=status;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.room=room;
        this.floor=floor;
        this.requestDate=requestDate;
        this.actionDate=actionDate;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getType() { return this.type; }
    public void setType(String type) { this.type = type; }

    public int getPOI() { return poi; }
    public void setPOI(int poi) { this.poi = poi; }

    public String getCategory() { return this.category; }
    public void setCategory(String category) { this.category = category; }

    public String getReason() { return this.reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getComment() { return this.comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getStatus() { return this.status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getRequestDate() { return this.requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public LocalDateTime getActionDate() { return this.actionDate; }
    public void setActionDate(LocalDateTime actionDate) { this.actionDate = actionDate; }
}