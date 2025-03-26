package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.model.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Student findByNrIndeksu(String nrIndeksu);
}
