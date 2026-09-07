import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/Student';

describe('StudentService', () => {

  let service: StudentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get all students', () => {
    // GIVEN
    const students: Student[] = [
      { id: 1, firstName: 'Jean', lastName: 'Dupont' },
      { id: 2, firstName: 'Marie', lastName: 'Martin' }
    ];

    // WHEN
    service.getAll().subscribe(result => {
      // THEN
      expect(result).toEqual(students);
    });

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('GET');

    request.flush(students);
  });

  it('should get a student by id', () => {
    // GIVEN
    const student: Student = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont'
    };

    // WHEN
    service.getById(1).subscribe(result => {
      // THEN
      expect(result).toEqual(student);
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('GET');

    request.flush(student);
  });

  it('should create a student', () => {
    // GIVEN
    const studentToCreate: Student = {
      firstName: 'Jean',
      lastName: 'Dupont'
    };

    const createdStudent: Student = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont'
    };

    // WHEN
    service.create(studentToCreate).subscribe(result => {
      // THEN
      expect(result).toEqual(createdStudent);
    });

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(studentToCreate);

    request.flush(createdStudent);
  });

  it('should update a student', () => {
    // GIVEN
    const studentToUpdate: Student = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Durand'
    };

    // WHEN
    service.update(1, studentToUpdate).subscribe(result => {
      // THEN
      expect(result).toEqual(studentToUpdate);
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(studentToUpdate);

    request.flush(studentToUpdate);
  });

  it('should delete a student', () => {
    // WHEN
    service.delete(1).subscribe(result => {
      // THEN
      expect(result).toBeNull();
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

});