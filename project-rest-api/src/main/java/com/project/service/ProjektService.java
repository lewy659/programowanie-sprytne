package com.project.service;

import com.project.model.Projekt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List; // Dodano import dla List
import java.util.Optional;

public interface ProjektService {
    Optional<Projekt> getProjekt(Integer projektId);
    Projekt saveProjekt(Projekt projekt);
    void deleteProjekt(Integer projektId);

    
    Page<Projekt> getProjekty(Pageable pageable);

    //  Pobieranie WSZYSTKICH projektów
    List<Projekt> getAllProjekty();

    // Metoda pobierania projektów dla danego studenta
    List<Projekt> getProjektyByStudentId(Integer studentId);
}
