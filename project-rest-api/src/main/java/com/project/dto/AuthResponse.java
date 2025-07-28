package com.project.dto;

public class AuthResponse {
    private String token;
    private Integer studentId; // DODANE POLE

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, Integer studentId) { // DODANY KONSTRUKTOR
        this.token = token;
        this.studentId = studentId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getStudentId() { // DODANY GETTER
        return studentId;
    }

    public void setStudentId(Integer studentId) { // DODANY SETTER
        this.studentId = studentId;
    }
}