package com.project.repository;

import com.project.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Student findByNrIndeksu(String nrIndeksu);

    List<Student> findByImieContainingIgnoreCase(String imie);
}
