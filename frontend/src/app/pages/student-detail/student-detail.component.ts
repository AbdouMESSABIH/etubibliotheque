import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private router = inject(Router);

  student?: Student;

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l’étudiant', error);
      }
    });
  }
  deleteStudent(): void {

    if (!this.student?.id) {
      return;
    }

    const confirmation = confirm(
     'Voulez-vous vraiment supprimer cet étudiant ?'
    );

    if (!confirmation) {
      return;
    }

    this.studentService.delete(this.student.id).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de l’étudiant', error);
      }
    });
  }
}