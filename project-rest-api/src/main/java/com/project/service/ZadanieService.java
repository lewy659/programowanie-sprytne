package com.project.service;

import com.project.model.Zadanie;
import java.util.List;

public interface ZadanieService {
    List<Zadanie> getZadaniaByProjektId(Integer projektId);
    Zadanie saveZadanie(Zadanie zadanie);
    void deleteZadanie(Integer zadanieId);

    // Metoda do przypisania studenta
    Zadanie przypiszStudenta(Integer zadanieId, Integer studentId);
}
