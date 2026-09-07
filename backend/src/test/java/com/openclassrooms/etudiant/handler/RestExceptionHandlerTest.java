package com.openclassrooms.etudiant.handler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RestExceptionHandlerTest {

    private RestExceptionHandler restExceptionHandler;
    private WebRequest webRequest;

    @BeforeEach
    public void setUp() {
        restExceptionHandler = new RestExceptionHandler();
        webRequest = mock(WebRequest.class);
        when(webRequest.getDescription(false)).thenReturn("uri=/api/test");
    }

    // BAD REQUEST
    @Test
    public void handleIllegalArgumentExceptionReturnsBadRequest() {
        // GIVEN
        IllegalArgumentException exception =
                new IllegalArgumentException("Invalid data");

        // WHEN
        ResponseEntity<Object> response =
                restExceptionHandler.handleConflict(exception, webRequest);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isInstanceOf(ErrorDetails.class);

        ErrorDetails errorDetails = (ErrorDetails) response.getBody();
        assertThat(errorDetails.getMessage()).isEqualTo("Invalid data");
        assertThat(errorDetails.getDetails()).isEqualTo("uri=/api/test");
    }

    // UNAUTHORIZED
    @Test
    public void handleBadCredentialsReturnsUnauthorized() {
        // GIVEN
        BadCredentialsException exception =
                new BadCredentialsException("Bad credentials");

        // WHEN
        ResponseEntity<Object> response =
                restExceptionHandler.handleBadCredentialsException(exception, webRequest);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isInstanceOf(ErrorDetails.class);

        ErrorDetails errorDetails = (ErrorDetails) response.getBody();
        assertThat(errorDetails.getMessage()).isEqualTo("Bad credentials");
        assertThat(errorDetails.getDetails()).isEqualTo("uri=/api/test");
    }

    // FORBIDDEN
    @Test
    public void handleAccessDeniedReturnsForbidden() {
        // GIVEN
        AccessDeniedException exception =
                new AccessDeniedException("Access denied");

        // WHEN
        ResponseEntity<Object> response =
                restExceptionHandler.handleForbiddenException(exception, webRequest);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isInstanceOf(ErrorDetails.class);

        ErrorDetails errorDetails = (ErrorDetails) response.getBody();
        assertThat(errorDetails.getMessage()).isEqualTo("Access denied");
        assertThat(errorDetails.getDetails()).isEqualTo("uri=/api/test");
    }

    // INTERNAL SERVER ERROR
    @Test
    public void handleExceptionReturnsInternalServerError() {
        // GIVEN
        RuntimeException exception =
                new RuntimeException("Unexpected error");

        // WHEN
        ResponseEntity<Object> response =
                restExceptionHandler.handleException(exception, webRequest);

        // THEN
        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);

        assertThat(response.getBody())
                .isEqualTo("Internal Server error");
    }
}