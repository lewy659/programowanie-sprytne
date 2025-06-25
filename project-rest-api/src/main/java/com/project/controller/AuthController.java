package com.project.controller;

import com.project.dto.AuthResponse;
import com.project.dto.LoginRequest;
import com.project.dto.RegisterRequest;
import com.project.model.Student;
import com.project.repository.StudentRepository;
import com.project.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
        if (studentRepository.findByNrIndeksu(request.getNrIndeksu()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Student student = new Student();
        student.setImie(request.getImie());
        student.setNazwisko(request.getNazwisko());
        student.setNrIndeksu(request.getNrIndeksu());
        student.setPassword(passwordEncoder.encode(request.getPassword()));

        student = studentRepository.save(student);

        String token = jwtService.generateToken(student.getNrIndeksu());
        return ResponseEntity.ok(new AuthResponse(token, student.getStudentId()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getNrIndeksu(),
                request.getPassword()
            )
        );

        Student student = studentRepository.findByNrIndeksu(request.getNrIndeksu());
        String token = jwtService.generateToken(student.getNrIndeksu());
        
        return ResponseEntity.ok(new AuthResponse(token, student.getStudentId()));
    }

    @GetMapping("/current-user")
    public ResponseEntity<Student> getCurrentUser(Authentication authentication) {
        String nrIndeksu = authentication.getName();
        Student student = studentRepository.findByNrIndeksu(nrIndeksu);
        return ResponseEntity.ok(student);
    }
}