package com.project.service;

import com.project.model.Student;
import java.util.Optional;

public interface StudentService {
    Optional<Student> getStudent(Integer studentId);
    Student saveStudent(Student student);
    void deleteStudent(Integer studentId);
}
