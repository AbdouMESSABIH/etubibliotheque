package com.openclassrooms.etudiant.configuration.security;

import com.openclassrooms.etudiant.service.JwtService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class JwtAuthenticationFilterBranchTest {

    private JwtService jwtService;
    private CustomUserDetailService customUserDetailService;
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();

        jwtService = mock(JwtService.class);
        customUserDetailService = mock(CustomUserDetailService.class);

        jwtAuthenticationFilter =
                new JwtAuthenticationFilter(jwtService, customUserDetailService);

        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        filterChain = mock(FilterChain.class);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldContinueWithoutAuthenticationWhenAuthorizationHeaderIsMissing()
            throws Exception {

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService);
        verifyNoInteractions(customUserDetailService);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldContinueWithoutAuthenticationWhenAuthorizationHeaderIsNotBearer()
            throws Exception {

        request.addHeader("Authorization", "Basic abc123");

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService);
        verifyNoInteractions(customUserDetailService);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldAuthenticateUserWhenTokenIsValid()
            throws Exception {

        request.addHeader("Authorization", "Bearer valid-token");

        UserDetails userDetails = User
                .withUsername("abdou")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        when(jwtService.extractUsername("valid-token"))
                .thenReturn("abdou");

        when(customUserDetailService.loadUserByUsername("abdou"))
                .thenReturn(userDetails);

        when(jwtService.isTokenValid("valid-token", userDetails))
                .thenReturn(true);

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        assertEquals("abdou", authentication.getName());

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldNotAuthenticateWhenTokenDoesNotContainLogin()
            throws Exception {

        request.addHeader("Authorization", "Bearer token-without-login");

        when(jwtService.extractUsername("token-without-login"))
                .thenReturn(null);

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(customUserDetailService, never())
                .loadUserByUsername(anyString());

        verify(jwtService, never())
                .isTokenValid(anyString(), any());

        assertNull(SecurityContextHolder.getContext().getAuthentication());

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldNotReplaceExistingAuthentication()
            throws Exception {

        request.addHeader("Authorization", "Bearer valid-token");

        Authentication existingAuthentication =
                new UsernamePasswordAuthenticationToken(
                        "already-authenticated",
                        null
                );

        SecurityContextHolder
                .getContext()
                .setAuthentication(existingAuthentication);

        when(jwtService.extractUsername("valid-token"))
                .thenReturn("abdou");

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        assertSame(
                existingAuthentication,
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(customUserDetailService, never())
                .loadUserByUsername(anyString());

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldNotAuthenticateWhenTokenIsInvalid()
            throws Exception {

        request.addHeader("Authorization", "Bearer invalid-token");

        UserDetails userDetails = User
                .withUsername("abdou")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        when(jwtService.extractUsername("invalid-token"))
                .thenReturn("abdou");

        when(customUserDetailService.loadUserByUsername("abdou"))
                .thenReturn(userDetails);

        when(jwtService.isTokenValid("invalid-token", userDetails))
                .thenReturn(false);

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        assertNull(SecurityContextHolder.getContext().getAuthentication());

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldContinueFilterChainWhenJwtParsingThrowsException()
            throws Exception {

        request.addHeader("Authorization", "Bearer broken-token");

        when(jwtService.extractUsername("broken-token"))
                .thenThrow(new IllegalArgumentException("Invalid JWT"));

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        assertNull(SecurityContextHolder.getContext().getAuthentication());

        verify(filterChain).doFilter(request, response);
    }
}
