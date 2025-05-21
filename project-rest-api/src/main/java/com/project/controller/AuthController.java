package com.project.controller;

import com.project.dto.*;
import com.project.model.Student;
import com.project.repository.StudentRepository;
import com.project.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        Student student = new Student();
        student.setImie(request.getImie());
        student.setNazwisko(request.getNazwisko());
        student.setNrIndeksu(request.getNrIndeksu());
        student.setPassword(passwordEncoder.encode(request.getPassword()));

        studentRepository.save(student);

        String token = jwtService.generateToken(student.getNrIndeksu());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNrIndeksu(), request.getPassword())
        );

        String token = jwtService.generateToken(request.getNrIndeksu());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
