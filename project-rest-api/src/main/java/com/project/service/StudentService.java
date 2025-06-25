package com.project.service;

import com.project.model.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    Optional<Student> getStudent(Integer studentId); // Istniejąca metoda
    Student saveStudent(Student student);
    void deleteStudent(Integer studentId);
    List<Student> findByImieContainingIgnoreCase(String imie);

    // NOWOŚĆ: Dodajemy metodę do wyszukiwania studenta po numerze indeksu
    Optional<Student> getStudentByNrIndeksu(String nrIndeksu);
}
