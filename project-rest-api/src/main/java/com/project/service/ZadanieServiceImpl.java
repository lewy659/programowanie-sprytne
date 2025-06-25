package com.project.service;

import com.project.model.Zadanie;
import com.project.model.Student;
import com.project.repository.ZadanieRepository;
import com.project.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ZadanieServiceImpl implements ZadanieService {

    private final ZadanieRepository zadanieRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public ZadanieServiceImpl(ZadanieRepository zadanieRepository, StudentRepository studentRepository) {
        this.zadanieRepository = zadanieRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Zadanie> getZadaniaByProjektId(Integer projektId) {
        return zadanieRepository.findByProjekt_ProjektId(projektId);
    }

    @Override
    public Zadanie saveZadanie(Zadanie zadanie) {
        return zadanieRepository.save(zadanie);
    }

    @Override
    public void deleteZadanie(Integer zadanieId) {
        zadanieRepository.deleteById(zadanieId);
    }

    @Override
    public Zadanie przypiszStudenta(Integer zadanieId, Integer studentId) {
        Optional<Zadanie> zadanieOpt = zadanieRepository.findById(zadanieId);
        Optional<Student> studentOpt = studentRepository.findById(studentId);

        if (zadanieOpt.isEmpty() || studentOpt.isEmpty()) {
            return null; // brak zadania lub studenta
        }

        Zadanie zadanie = zadanieOpt.get();
        Student student = studentOpt.get();

        zadanie.setStudent(student);
        return zadanieRepository.save(zadanie);
    }
}
