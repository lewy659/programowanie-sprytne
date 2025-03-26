package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.model.Projekt;
import java.util.List;

public interface ProjektRepository extends JpaRepository<Projekt, Integer> {
    List<Projekt> findByNazwaContainingIgnoreCase(String nazwa);
}
