package com.project.service;

import com.project.model.Projekt;
import com.project.repository.ProjektRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List; // Dodaj ten import
import java.util.Optional;

@Service 
public class ProjektServiceImpl implements ProjektService { 

    private final ProjektRepository projektRepository;

    @Autowired
    public ProjektServiceImpl(ProjektRepository projektRepository) {
        this.projektRepository = projektRepository;
    }

    @Override
    public Optional<Projekt> getProjekt(Integer projektId) {
        return projektRepository.findById(projektId);
    }

    @Override
    public Projekt saveProjekt(Projekt projekt) {
        return projektRepository.save(projekt);
    }

    @Override
    public void deleteProjekt(Integer projektId) {
        projektRepository.deleteById(projektId);
    }

    @Override
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektRepository.findAll(pageable);
    }

    @Override
    public List<Projekt> getAllProjekty() {
        return projektRepository.findAll();
    }

    @Override
    public List<Projekt> getProjektyByStudentId(Integer studentId) {
       
        return projektRepository.findByStudenci_StudentId(studentId);
    }
}
