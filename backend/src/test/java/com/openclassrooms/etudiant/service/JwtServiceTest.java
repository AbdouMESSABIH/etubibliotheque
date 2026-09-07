package com.openclassrooms.etudiant.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

public class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        jwtService = new JwtService();

        ReflectionTestUtils.setField(
                jwtService,
                "secretKey",
                "0123456789012345678901234567890123456789012345678901234567890123"
        );

        ReflectionTestUtils.setField(
                jwtService,
                "expirationTime",
                3600000L
        );

        userDetails = User.builder()
                .username("test")
                .password("password")
                .authorities("ROLE_USER")
                .build();
    }


    // GENERATE TOKEN
    @Test
    public void test_generate_token() {
        // WHEN
        String token = jwtService.generateToken(userDetails);

        // THEN
        assertThat(token).isNotNull();
        assertThat(token).isNotBlank();
    }


    // EXTRACT USERNAME
    @Test
    public void test_extract_username() {
        // GIVEN
        String token = jwtService.generateToken(userDetails);

        // WHEN
        String username = jwtService.extractUsername(token);

        // THEN
        assertThat(username).isEqualTo("test");
    }


    // VALID TOKEN
    @Test
    public void test_valid_token() {
        // GIVEN
        String token = jwtService.generateToken(userDetails);

        // WHEN
        boolean valid = jwtService.isTokenValid(token, userDetails);

        // THEN
        assertThat(valid).isTrue();
    }


    // TOKEN FOR WRONG USER
    @Test
    public void test_token_invalid_for_another_user() {
        // GIVEN
        String token = jwtService.generateToken(userDetails);

        UserDetails anotherUser = User.builder()
                .username("anotherUser")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        // WHEN
        boolean valid = jwtService.isTokenValid(token, anotherUser);

        // THEN
        assertThat(valid).isFalse();
    }
}