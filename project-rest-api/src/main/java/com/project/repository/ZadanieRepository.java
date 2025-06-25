package com.project.repository;

import com.project.model.Zadanie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ZadanieRepository extends JpaRepository<Zadanie, Integer> {
    List<Zadanie> findByProjekt_ProjektId(Integer projektId);
}
