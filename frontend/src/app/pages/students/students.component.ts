import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';


@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  private studentService = inject(StudentService);

  students: Student[] = [];

  ngOnInit(): void {
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des étudiants', error);
      }
    });
  }
}