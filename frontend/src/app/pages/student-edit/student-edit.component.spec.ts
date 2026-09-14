import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentEditComponent } from './student-edit.component';
import { StudentService } from '../../core/service/student.service';

describe('StudentEditComponent', () => {

  let component: StudentEditComponent;
  let fixture: ComponentFixture<StudentEditComponent>;

  let studentServiceMock: {
    getById: jest.Mock;
    update: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  beforeEach(async () => {

    studentServiceMock = {
      getById: jest.fn(),
      update: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    studentServiceMock.getById.mockReturnValue(
      of({
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont'
      })
    );

    await TestBed.configureTestingModule({
      imports: [StudentEditComponent],
      providers: [
        {
          provide: StudentService,
          useValue: studentServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student and fill the form', () => {
    // THEN
    expect(studentServiceMock.getById).toHaveBeenCalledWith(1);

    expect(component.studentId).toBe(1);

    expect(component.studentForm.value).toEqual({
      firstName: 'Jean',
      lastName: 'Dupont'
    });
  });

  it('should display an error when student loading fails', () => {
    // GIVEN
    const error = new Error('Erreur chargement');

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    studentServiceMock.getById.mockReturnValue(
      throwError(() => error)
    );

    // WHEN
    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // THEN
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors du chargement de l’étudiant',
      error
    );

    expect(component.errorMessage)
      .toBe('Impossible de charger les informations de l’étudiant.');

    consoleSpy.mockRestore();
  });

  it('should not update student when form is invalid', () => {
    // GIVEN
    component.studentForm.setValue({
      firstName: '',
      lastName: ''
    });

    // WHEN
    component.onSubmit();

    // THEN
    expect(studentServiceMock.update).not.toHaveBeenCalled();
  });

  it('should update student and navigate to student detail', () => {
    // GIVEN
    component.studentForm.setValue({
      firstName: 'Jean',
      lastName: 'Durand'
    });

    studentServiceMock.update.mockReturnValue(
      of({
        id: 1,
        firstName: 'Jean',
        lastName: 'Durand'
      })
    );

    // WHEN
    component.onSubmit();

    // THEN
    expect(studentServiceMock.update).toHaveBeenCalledWith(
      1,
      {
        firstName: 'Jean',
        lastName: 'Durand'
      }
    );

    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/students', 1]
    );
  });

  it('should display an error when update fails', () => {
    // GIVEN
    const error = new Error('Erreur test');

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    component.studentForm.setValue({
      firstName: 'Jean',
      lastName: 'Durand'
    });

    studentServiceMock.update.mockReturnValue(
      throwError(() => error)
    );

    // WHEN
    component.onSubmit();

    // THEN
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors de la modification de l’étudiant',
      error
    );

    expect(component.errorMessage)
      .toBe('Impossible de modifier l’étudiant. Veuillez réessayer.');

    expect(routerMock.navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

});