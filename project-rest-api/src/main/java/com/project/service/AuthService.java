package com.project.service;

import com.project.dto.AuthRequest;
import com.project.dto.AuthResponse;
import com.project.model.User;
import com.project.repository.UserRepository;
import com.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        Optional<User> user = userRepository.findByUsername(request.getUsername());
        if (user.isPresent() && passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            String token = jwtService.generateToken(user.get().getUsername());
            return new AuthResponse(token);
        } else {
            throw new RuntimeException("Niepoprawne dane logowania");
        }
    }

    public void register(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Użytkownik już istnieje");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        userRepository.save(new User(request.getUsername(), encodedPassword));
    }
}
