package com.project.service;

import com.project.model.Student;
import com.project.repository.StudentRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;

    public CustomUserDetailsService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String nrIndeksu) throws UsernameNotFoundException {
        Student student = studentRepository.findByNrIndeksu(nrIndeksu);
        if (student == null) {
            throw new UsernameNotFoundException("Student not found with nrIndeksu: " + nrIndeksu);
        }

        return new User(
            student.getNrIndeksu(),
            student.getPassword(),
            Collections.emptyList()
        );
    }
}