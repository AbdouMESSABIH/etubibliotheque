import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentId!: number;

  studentForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  ngOnInit(): void {

    this.studentId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.studentService.getById(this.studentId).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l’étudiant', error);
      }
    });
  }

  onSubmit(): void {

    if (this.studentForm.invalid) {
      return;
    }

    const student: Student = {
      firstName: this.studentForm.value.firstName!,
      lastName: this.studentForm.value.lastName!
    };

    this.studentService.update(this.studentId, student).subscribe({
      next: () => {
        this.router.navigate(['/students', this.studentId]);
      },
      error: (error) => {
        console.error('Erreur lors de la modification de l’étudiant', error);
      }
    });
  }
}