package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.model.Zadanie;
import java.util.List;

public interface ZadanieRepository extends JpaRepository<Zadanie, Integer> {
    List<Zadanie> findByProjekt_ProjektId(Integer projektId);
}
