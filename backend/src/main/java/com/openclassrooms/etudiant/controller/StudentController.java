package com.openclassrooms.etudiant.controller;

import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import com.openclassrooms.etudiant.dto.StudentDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;


@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentDtoMapper studentDtoMapper;

        @PostMapping
    public ResponseEntity<StudentDTO> createStudent(
            @Valid @RequestBody StudentDTO studentDTO) {

        Student student = studentDtoMapper.toEntity(studentDTO);
        Student savedStudent = studentService.create(student);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentDtoMapper.toDto(savedStudent));
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {

        List<StudentDTO> students = studentService.findAll()
                .stream()
                .map(studentDtoMapper::toDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {

        Student student = studentService.findById(id);

        return ResponseEntity.ok(
            studentDtoMapper.toDto(student)
        );
}
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO studentDTO) {

        Student student = studentDtoMapper.toEntity(studentDTO);

        Student updatedStudent = studentService.update(id, student);

        return ResponseEntity.ok(
                studentDtoMapper.toDto(updatedStudent)
    );
}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {

        studentService.delete(id);

        return ResponseEntity.noContent().build();
}
}