package com.project.repository;

import com.project.model.Projekt;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjektRepository extends JpaRepository<Projekt, Integer> {
    List<Projekt> findByNazwaContainingIgnoreCase(String nazwa);

    @EntityGraph(attributePaths = {"zadania", "studenci"})
    Optional<Projekt> findById(Integer projektId);
}
