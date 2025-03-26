package com.project.model;

import jakarta.persistence.*;

@Entity
@Table(name="zadanie")
public class Zadanie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="zadanie_id")
    private Integer zadanieId;

    @Column(nullable = false, length = 100)
    private String nazwa;

    @Column(length = 255)
    private String opis;

    @ManyToOne
    @JoinColumn(name = "projekt_id")
    private Projekt projekt;

    public Zadanie() {}

    public Zadanie(String nazwa, String opis, Projekt projekt) {
        this.nazwa = nazwa;
        this.opis = opis;
        this.projekt = projekt;
    }

    public Integer getZadanieId() { return zadanieId; }
    public void setZadanieId(Integer zadanieId) { this.zadanieId = zadanieId; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    public Projekt getProjekt() { return projekt; }
    public void setProjekt(Projekt projekt) { this.projekt = projekt; }
}
