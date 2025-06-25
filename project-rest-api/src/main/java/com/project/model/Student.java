package com.project.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;

    @Column(nullable = false, length = 50)
    private String imie;

    @Column(nullable = false, length = 50)
    private String nazwisko;

    @Column(unique = true, length = 10)
    private String nrIndeksu;

    @Column(nullable = false)
    private String password;

    @ManyToMany(mappedBy = "studenci")
    @JsonIgnoreProperties("studenci")
    private Set<Projekt> projekty;

    public Student() {}

    public Student(String imie, String nazwisko, String nrIndeksu) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.nrIndeksu = nrIndeksu;
    }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getImie() { return imie; }
    public void setImie(String imie) { this.imie = imie; }

    public String getNazwisko() { return nazwisko; }
    public void setNazwisko(String nazwisko) { this.nazwisko = nazwisko; }

    public String getNrIndeksu() { return nrIndeksu; }
    public void setNrIndeksu(String nrIndeksu) { this.nrIndeksu = nrIndeksu; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<Projekt> getProjekty() { return projekty; }
    public void setProjekty(Set<Projekt> projekty) { this.projekty = projekty; }
}
