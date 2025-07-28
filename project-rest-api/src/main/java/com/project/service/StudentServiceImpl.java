package com.project.service;

import com.project.model.Student;
import com.project.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public Optional<Student> getStudent(Integer studentId) {
        return studentRepository.findById(studentId);
    }

    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Integer studentId) {
        studentRepository.deleteById(studentId);
    }

    @Override
    public List<Student> findByImieContainingIgnoreCase(String imie) {
        return studentRepository.findByImieContainingIgnoreCase(imie);
    }

    
    @Override
    public Optional<Student> getStudentByNrIndeksu(String nrIndeksu) {
        return Optional.ofNullable(studentRepository.findByNrIndeksu(nrIndeksu));
    }
}
