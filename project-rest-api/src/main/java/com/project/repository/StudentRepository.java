package com.project.repository;

import com.project.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    // Zwraca Student lub null, jeśli nie znaleziono
    Student findByNrIndeksu(String nrIndeksu);

    // Wyszukiwanie studentów po imieniu, ignorując wielkość liter, częściowe dopasowanie
    List<Student> findByImieContainingIgnoreCase(String imie);
}
