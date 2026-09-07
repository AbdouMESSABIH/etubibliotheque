package com.openclassrooms.etudiant.service; 

import java.util.List;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Student create(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> findAll() {
    return studentRepository.findAll();
    }

    public Student findById(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                    "Student not found with id: " + id
            ));
    }
    public Student update(Long id, Student student) {

        Student existingStudent = findById(id);

        existingStudent.setFirstName(student.getFirstName());
        existingStudent.setLastName(student.getLastName());

        return studentRepository.save(existingStudent);
    }  
    public void delete(Long id) {
     Student existingStudent = findById(id);
        studentRepository.delete(existingStudent);
    }
}
