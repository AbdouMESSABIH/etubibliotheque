package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.StudentDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String URL = "/api/students";
    private static final String LOGIN = "student-test-user";
    private static final String PASSWORD = "password";

    @Container
    static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.0.36");

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MockMvc mockMvc;

    private String token;

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
        registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
        registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }

    @BeforeEach
    public void beforeEach() {
        studentRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setLogin(LOGIN);
        user.setPassword(PASSWORD);

        userService.register(user);
        token = userService.login(LOGIN, PASSWORD);
    }

    @AfterEach
    public void afterEach() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    // CREATE
    @Test
    public void createStudentSuccessful() throws Exception {
        // GIVEN
        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setFirstName("Lucas");
        studentDTO.setLastName("Martin");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(studentDTO))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Lucas"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Martin"));
    }

    // READ ALL
    @Test
    public void getAllStudentsSuccessful() throws Exception {
        // GIVEN
        Student student1 = new Student();
        student1.setFirstName("Lucas");
        student1.setLastName("Martin");
        studentRepository.save(student1);

        Student student2 = new Student();
        student2.setFirstName("Sarah");
        student2.setLastName("Bernard");
        studentRepository.save(student2);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get(URL)
                        .header("Authorization", "Bearer " + token)
                        .accept(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2));
    }

    // READ BY ID
    @Test
    public void getStudentByIdSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName("Lucas");
        student.setLastName("Martin");
        Student savedStudent = studentRepository.save(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get(URL + "/" + savedStudent.getId())
                        .header("Authorization", "Bearer " + token)
                        .accept(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(savedStudent.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Lucas"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Martin"));
    }

    // UPDATE
    @Test
    public void updateStudentSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName("Lucas");
        student.setLastName("Bernard");
        Student savedStudent = studentRepository.save(student);

        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setFirstName("Lucas");
        studentDTO.setLastName("Martin");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put(URL + "/" + savedStudent.getId())
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(studentDTO))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Lucas"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Martin"));

        Student updatedStudent = studentRepository.findById(savedStudent.getId()).orElseThrow();
        assertThat(updatedStudent.getLastName()).isEqualTo("Martin");
    }

    // DELETE
    @Test
    public void deleteStudentSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName("Lucas");
        student.setLastName("Martin");
        Student savedStudent = studentRepository.save(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete(URL + "/" + savedStudent.getId())
                        .header("Authorization", "Bearer " + token))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        assertThat(studentRepository.findById(savedStudent.getId())).isEmpty();
    }

    // SECURITY
    @Test
    public void accessStudentsWithoutTokenReturnsUnauthorized() throws Exception {
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get(URL)
                        .accept(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    // VALIDATION
    @Test
    public void createStudentWithoutRequiredDataReturnsBadRequest() throws Exception {
        // GIVEN
        StudentDTO studentDTO = new StudentDTO();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + token)
                        .content(objectMapper.writeValueAsString(studentDTO))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
}