import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent {

  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);

  studentForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  onSubmit(): void {

    if (this.studentForm.invalid) {
      return;
    }

    const student: Student = {
      firstName: this.studentForm.value.firstName!,
      lastName: this.studentForm.value.lastName!
    };

    this.studentService.create(student).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Erreur lors de la création de l’étudiant', error);
      }
    });
  }
}