package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;


    // CREATE
    @Test
    public void test_create_student() {
        // GIVEN
        Student student = new Student();
        student.setFirstName("Lucas");
        student.setLastName("Martin");

        // WHEN
        studentService.create(student);

        // THEN
        ArgumentCaptor<Student> studentCaptor =
                ArgumentCaptor.forClass(Student.class);

        verify(studentRepository).save(studentCaptor.capture());

        assertThat(studentCaptor.getValue())
                .isEqualTo(student);
    }


    // READ - liste
    @Test
    public void test_find_all_students() {
        // GIVEN
        Student student1 = new Student();
        student1.setFirstName("Lucas");
        student1.setLastName("Martin");

        Student student2 = new Student();
        student2.setFirstName("Sarah");
        student2.setLastName("Bernard");

        when(studentRepository.findAll())
                .thenReturn(List.of(student1, student2));

        // WHEN
        List<Student> students = studentService.findAll();

        // THEN
        assertThat(students)
                .containsExactly(student1, student2);
    }


    // READ - détail
    @Test
    public void test_find_student_by_id() {
        // GIVEN
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("Lucas");
        student.setLastName("Martin");

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        // WHEN
        Student result = studentService.findById(1L);

        // THEN
        assertThat(result)
                .isEqualTo(student);
    }


    // UPDATE
    @Test
    public void test_update_student() {
        // GIVEN
        Student existingStudent = new Student();
        existingStudent.setId(1L);
        existingStudent.setFirstName("Lucas");
        existingStudent.setLastName("Bernard");

        Student newValues = new Student();
        newValues.setFirstName("Lucas");
        newValues.setLastName("Martin");

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(existingStudent));

        when(studentRepository.save(existingStudent))
                .thenReturn(existingStudent);

        // WHEN
        Student result = studentService.update(1L, newValues);

        // THEN
        assertThat(result.getFirstName())
                .isEqualTo("Lucas");

        assertThat(result.getLastName())
                .isEqualTo("Martin");

        verify(studentRepository).save(existingStudent);
    }


    // DELETE
    @Test
    public void test_delete_student() {
        // GIVEN
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("Lucas");
        student.setLastName("Martin");

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        // WHEN
        studentService.delete(1L);

        // THEN
        verify(studentRepository).delete(student);
    }

    @Test
    public void test_find_student_by_id_not_found() {
        // GIVEN
        when(studentRepository.findById(999L))
            .thenReturn(Optional.empty());

        // THEN
        org.junit.jupiter.api.Assertions.assertThrows(
            IllegalArgumentException.class,
            () -> studentService.findById(999L)
    );
}
}