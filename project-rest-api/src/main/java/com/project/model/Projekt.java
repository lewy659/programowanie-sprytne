package com.project.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="projekt")
public class Projekt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="projekt_id")
    private Integer projektId;

    @Column(nullable = false, length = 50)
    private String nazwa;

    @Column(length = 255)
    private String opis;

    @OneToMany(mappedBy = "projekt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Zadanie> zadania;

    @ManyToMany
    @JoinTable(name = "projekt_student",
               joinColumns = @JoinColumn(name="projekt_id"),
               inverseJoinColumns = @JoinColumn(name="student_id"))
    private Set<Student> studenci;

    public Projekt() {}

    public Projekt(String nazwa, String opis) {
        this.nazwa = nazwa;
        this.opis = opis;
    }

    public Integer getProjektId() { return projektId; }
    public void setProjektId(Integer projektId) { this.projektId = projektId; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    public List<Zadanie> getZadania() { return zadania; }
    public void setZadania(List<Zadanie> zadania) { this.zadania = zadania; }
    public Set<Student> getStudenci() { return studenci; }
    public void setStudenci(Set<Student> studenci) { this.studenci = studenci; }
}
