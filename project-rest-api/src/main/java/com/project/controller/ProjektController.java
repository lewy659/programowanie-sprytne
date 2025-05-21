package com.project.controller;


import com.project.model.Projekt;
import com.project.service.ProjektService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/projekty")
public class ProjektController {

	


    private final ProjektService projektService;

    @Autowired
    public ProjektController(ProjektService projektService) {
        this.projektService = projektService;
    }

    @GetMapping
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektService.getProjekty(pageable);
    }

    @GetMapping("/{projektId}")
    public ResponseEntity<Projekt> getProjekt(@PathVariable("projektId") Integer projektId)

    {
        Optional<Projekt> projekt = projektService.getProjekt(projektId);
        return projekt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    

    @PostMapping
    public ResponseEntity<Projekt> createProjekt(@RequestBody Projekt projekt) {
        Projekt savedProjekt = projektService.saveProjekt(projekt);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProjekt);
    }

    @PutMapping("/{projektId}")
    public ResponseEntity<Projekt> updateProjekt(@PathVariable Integer projektId, @RequestBody Projekt projekt) {
        if (!projektService.getProjekt(projektId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        projekt.setProjektId(projektId);
        Projekt updatedProjekt = projektService.saveProjekt(projekt);
        return ResponseEntity.ok(updatedProjekt);
    }

    @DeleteMapping("/{projektId}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable Integer projektId) {
        if (!projektService.getProjekt(projektId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        projektService.deleteProjekt(projektId);
        return ResponseEntity.noContent().build();
    }
}