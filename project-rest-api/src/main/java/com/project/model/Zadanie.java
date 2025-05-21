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
    @JsonIgnoreProperties("zadania") // 🔧 To dodaj
    private Projekt projekt;

    public Zadanie() {}

    public Zadanie(String nazwa, Projekt projekt) {
        this.nazwa = nazwa;
        this.projekt = projekt;
    }

    public Integer getZadanieId() { return zadanieId; }
    public void setZadanieId(Integer zadanieId) { this.zadanieId = zadanieId; }

    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }

    public Projekt getProjekt() { return projekt; }
    public void setProjekt(Projekt projekt) { this.projekt = projekt; }
}
