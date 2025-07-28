package com.project.controller;

import com.project.model.Projekt;
import com.project.model.Student;
import com.project.repository.StudentRepository;
import com.project.service.ProjektService; // Upewnij się, że importujesz interfejs
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Dodano import dla List
import java.util.Optional;

@RestController
@RequestMapping("/api/projekty")
public class ProjektController {

    private final ProjektService projektService;
    private final StudentRepository studentRepository;

    @Autowired
    public ProjektController(ProjektService projektService, StudentRepository studentRepository) {
        this.projektService = projektService;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Projekt> getProjekty() {
        return projektService.getAllProjekty(); 
    }

    @GetMapping("/{projektId}")
    public ResponseEntity<Projekt> getProjekt(@PathVariable("projektId") Integer projektId) {
        Optional<Projekt> projekt = projektService.getProjekt(projektId);
        return projekt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Projekt> createProjekt(@RequestBody Projekt projekt) {
        Projekt savedProjekt = projektService.saveProjekt(projekt);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProjekt);
    }

    @PutMapping("/{projektId}")
    public ResponseEntity<Projekt> updateProjekt(
            @PathVariable("projektId") Integer projektId,
            @RequestBody Projekt projekt
    ) {
        if (!projektService.getProjekt(projektId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        projekt.setProjektId(projektId);
        Projekt updatedProjekt = projektService.saveProjekt(projekt);
        return ResponseEntity.ok(updatedProjekt);
    }

    @DeleteMapping("/{projektId}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable("projektId") Integer projektId) {
        if (!projektService.getProjekt(projektId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        projektService.deleteProjekt(projektId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{projektId}/dodaj-studenta/{studentId}")
    public ResponseEntity<Projekt> dodajStudentaDoProjektu(
            @PathVariable("projektId") Integer projektId,
            @PathVariable("studentId") Integer studentId
    ) {
        Optional<Projekt> optionalProjekt = projektService.getProjekt(projektId);
        Optional<Student> optionalStudent = studentRepository.findById(studentId);

        if (optionalProjekt.isEmpty() || optionalStudent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Projekt projekt = optionalProjekt.get();
        Student student = optionalStudent.get();

        if (projekt.getStudenci().contains(student)) {
            return ResponseEntity.ok(projekt);
        }

        projekt.getStudenci().add(student);
        Projekt updatedProjekt = projektService.saveProjekt(projekt);

        return ResponseEntity.ok(updatedProjekt);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Projekt>> getProjektyForStudent(@PathVariable("studentId") Integer studentId) {
        List<Projekt> projekty = projektService.getProjektyByStudentId(studentId);
        if (projekty.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(projekty);
    }

    @DeleteMapping("/{projektId}/usun-studenta/{studentId}")
    public ResponseEntity<Projekt> usunStudentaZProjektu(
            @PathVariable("projektId") Integer projektId,
            @PathVariable("studentId") Integer studentId
    ) {
        Optional<Projekt> optionalProjekt = projektService.getProjekt(projektId);
        Optional<Student> optionalStudent = studentRepository.findById(studentId);

        if (optionalProjekt.isEmpty() || optionalStudent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Projekt projekt = optionalProjekt.get();
        Student student = optionalStudent.get();

        if (!projekt.getStudenci().contains(student)) {
            return ResponseEntity.badRequest().build();
        }

        projekt.getStudenci().remove(student);
        Projekt updatedProjekt = projektService.saveProjekt(projekt);

        return ResponseEntity.ok(updatedProjekt);
    }
}
