package com.project.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "zadanie")
public class Zadanie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zadanie_id")
    private Integer zadanieId;

    @Column(nullable = false)
    private String nazwa;

    @ManyToOne
    @JoinColumn(name = "projekt_id")
    @JsonIgnoreProperties("zadania")
    private Projekt projekt;

    @ManyToOne
    @JoinColumn(name = "student_id")  // Klucz obcy do studenta
    @JsonIgnoreProperties({"projekty"}) 
    private Student student;

    @Column(nullable = false)
    private Integer kolejnosc;

    public Zadanie() {}

    public Zadanie(String nazwa, Projekt projekt, Integer kolejnosc) {
        this.nazwa = nazwa;
        this.projekt = projekt;
        this.kolejnosc = kolejnosc;
    }

    public Integer getZadanieId() {
        return zadanieId;
    }

    public void setZadanieId(Integer zadanieId) {
        this.zadanieId = zadanieId;
    }

    public String getNazwa() {
        return nazwa;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public Projekt getProjekt() {
        return projekt;
    }

    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }

    public Integer getKolejnosc() {
        return kolejnosc;
    }

    public void setKolejnosc(Integer kolejnosc) {
        this.kolejnosc = kolejnosc;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
