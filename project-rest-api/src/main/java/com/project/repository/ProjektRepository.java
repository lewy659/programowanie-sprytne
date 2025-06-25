package com.project.repository;

import com.project.model.Projekt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // Dodaj ten import

public interface ProjektRepository extends JpaRepository<Projekt, Integer> {
    // Istniejące metody...

    // NOWA METODA: Znajdź projekty, do których należy dany student
    List<Projekt> findByStudenci_StudentId(Integer studentId);
}