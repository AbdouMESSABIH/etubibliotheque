import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentCreateComponent } from './student-create.component';
import { StudentService } from '../../core/service/student.service';

describe('StudentCreateComponent', () => {

  let component: StudentCreateComponent;
  let fixture: ComponentFixture<StudentCreateComponent>;

  let studentServiceMock: {
    create: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  beforeEach(async () => {

    studentServiceMock = {
      create: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [StudentCreateComponent],
      providers: [
        {
          provide: StudentService,
          useValue: studentServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create a student when form is invalid', () => {
    // WHEN
    component.onSubmit();

    // THEN
    expect(studentServiceMock.create).not.toHaveBeenCalled();
  });

  it('should create a student and navigate to students page', () => {
    // GIVEN
    component.studentForm.setValue({
      firstName: 'Jean',
      lastName: 'Dupont'
    });

    studentServiceMock.create.mockReturnValue(
      of({
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont'
      })
    );

    // WHEN
    component.onSubmit();

    // THEN
    expect(studentServiceMock.create).toHaveBeenCalledWith({
      firstName: 'Jean',
      lastName: 'Dupont'
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should handle an error when student creation fails', () => {
    // GIVEN
    const error = new Error('Erreur test');

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.studentForm.setValue({
      firstName: 'Jean',
      lastName: 'Dupont'
    });

    studentServiceMock.create.mockReturnValue(
      throwError(() => error)
    );

    // WHEN
    component.onSubmit();

    // THEN
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors de la création de l’étudiant',
      error
    );

    expect(routerMock.navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

});