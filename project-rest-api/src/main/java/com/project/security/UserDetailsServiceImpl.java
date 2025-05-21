package com.project.security;

import com.project.model.Student;
import com.project.repository.StudentRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final StudentRepository studentRepository;

    public UserDetailsServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String nrIndeksu) throws UsernameNotFoundException {
        Student student = studentRepository.findByNrIndeksu(nrIndeksu);
        if (student == null) {
            throw new UsernameNotFoundException("Student nie znaleziony: " + nrIndeksu);
        }

        return User.builder()
                .username(student.getNrIndeksu())
                .password(student.getPassword()) 
                .roles("USER")
                .build();
    }
}
