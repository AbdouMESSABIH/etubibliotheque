import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../core/service/student.service';

describe('StudentDetailComponent', () => {

  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;

  let studentServiceMock: {
    getById: jest.Mock;
    delete: jest.Mock;
  };

  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {

    studentServiceMock = {
      getById: jest.fn(),
      delete: jest.fn()
    };

    studentServiceMock.getById.mockReturnValue(
      of({
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont'
      })
    );

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideRouter([]),
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
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student', () => {
    expect(studentServiceMock.getById)
      .toHaveBeenCalledWith(1);

    expect(component.student).toEqual({
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont'
    });

    expect(component.errorMessage).toBe('');
  });

  it('should display an error when student loading fails', () => {
    const error = new Error('Erreur chargement');

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    studentServiceMock.getById.mockReturnValue(
      throwError(() => error)
    );

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors du chargement de l’étudiant',
      error
    );

    expect(component.errorMessage)
      .toBe(
        'Impossible de charger les informations de l’étudiant.'
      );

    expect(fixture.nativeElement.textContent)
      .toContain(
        'Impossible de charger les informations de l’étudiant.'
      );

    consoleSpy.mockRestore();
  });

  it('should not delete when student has no id', () => {
    component.student = {
      firstName: 'Jean',
      lastName: 'Dupont'
    };

    component.deleteStudent();

    expect(studentServiceMock.delete)
      .not.toHaveBeenCalled();
  });

  it('should not delete when user cancels confirmation', () => {
    const confirmSpy = jest
      .spyOn(window, 'confirm')
      .mockReturnValue(false);

    component.deleteStudent();

    expect(studentServiceMock.delete)
      .not.toHaveBeenCalled();

    expect(navigateSpy)
      .not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('should delete student and navigate to students page', () => {
    const confirmSpy = jest
      .spyOn(window, 'confirm')
      .mockReturnValue(true);

    studentServiceMock.delete.mockReturnValue(
      of(undefined)
    );

    component.deleteStudent();

    expect(studentServiceMock.delete)
      .toHaveBeenCalledWith(1);

    expect(navigateSpy)
      .toHaveBeenCalledWith(['/students']);

    confirmSpy.mockRestore();
  });

  it('should display an error when student deletion fails', () => {
    const error = new Error('Erreur suppression');

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const confirmSpy = jest
      .spyOn(window, 'confirm')
      .mockReturnValue(true);

    studentServiceMock.delete.mockReturnValue(
      throwError(() => error)
    );

    component.deleteStudent();

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors de la suppression de l’étudiant',
      error
    );

    expect(component.errorMessage)
      .toBe(
        'Impossible de supprimer l’étudiant. Veuillez réessayer.'
      );

    expect(navigateSpy)
      .not.toHaveBeenCalled();

    expect(fixture.nativeElement.textContent)
      .toContain(
        'Impossible de supprimer l’étudiant. Veuillez réessayer.'
      );

    confirmSpy.mockRestore();
    consoleSpy.mockRestore();
  });

});