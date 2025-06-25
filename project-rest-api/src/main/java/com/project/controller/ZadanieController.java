package com.project.controller;

import com.project.model.Zadanie;
import com.project.service.ZadanieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zadania")
public class ZadanieController {

    private final ZadanieService zadanieService;

    @Autowired
    public ZadanieController(ZadanieService zadanieService) {
        this.zadanieService = zadanieService;
    }

    @GetMapping("/projekt/{projektId}")
    public List<Zadanie> getZadaniaByProjektId(@PathVariable("projektId") Integer projektId) {
        return zadanieService.getZadaniaByProjektId(projektId);
    }

    @PostMapping
    public ResponseEntity<Zadanie> createZadanie(@RequestBody Zadanie zadanie) {
        if (zadanie.getKolejnosc() == null) {
            zadanie.setKolejnosc(1);
        }
        Zadanie savedZadanie = zadanieService.saveZadanie(zadanie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedZadanie);
    }

    @DeleteMapping("/{zadanieId}")
    public ResponseEntity<Void> deleteZadanie(@PathVariable("zadanieId") Integer zadanieId) {
        zadanieService.deleteZadanie(zadanieId);
        return ResponseEntity.noContent().build();
    }

    // Przypisz studenta do zadania
    @PutMapping("/{zadanieId}/student/{studentId}")
    public ResponseEntity<?> przypiszStudentaDoZadania(
        @PathVariable("zadanieId") Integer zadanieId,
        @PathVariable("studentId") Integer studentId) {

        Zadanie updatedZadanie = zadanieService.przypiszStudenta(zadanieId, studentId);
        if (updatedZadanie == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedZadanie);
    }
}
