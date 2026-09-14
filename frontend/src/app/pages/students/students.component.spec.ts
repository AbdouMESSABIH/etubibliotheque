import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentsComponent } from './students.component';
import { StudentService } from '../../core/service/student.service';

describe('StudentsComponent', () => {

  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;

  let studentServiceMock: {
    getAll: jest.Mock;
  };

  beforeEach(async () => {

    studentServiceMock = {
      getAll: jest.fn()
    };

    studentServiceMock.getAll.mockReturnValue(
      of([
        {
          id: 1,
          firstName: 'Jean',
          lastName: 'Dupont'
        },
        {
          id: 2,
          firstName: 'Marie',
          lastName: 'Durand'
        }
      ])
    );

    await TestBed.configureTestingModule({
      imports: [StudentsComponent],
      providers: [
        {
          provide: StudentService,
          useValue: studentServiceMock
        },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students', () => {
    // THEN
    expect(studentServiceMock.getAll).toHaveBeenCalled();

    expect(component.students).toEqual([
      {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont'
      },
      {
        id: 2,
        firstName: 'Marie',
        lastName: 'Durand'
      }
    ]);

    expect(component.errorMessage).toBe('');
  });

  it('should display an error when students loading fails', () => {
    // GIVEN
    const error = new Error('Erreur chargement');

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    studentServiceMock.getAll.mockReturnValue(
      throwError(() => error)
    );

    // WHEN
    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // THEN
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors du chargement des étudiants',
      error
    );

    expect(component.errorMessage)
      .toBe(
        'Impossible de charger la liste des étudiants. Veuillez réessayer.'
      );

    expect(fixture.nativeElement.textContent)
      .toContain(
        'Impossible de charger la liste des étudiants. Veuillez réessayer.'
      );

    consoleSpy.mockRestore();
  });

});