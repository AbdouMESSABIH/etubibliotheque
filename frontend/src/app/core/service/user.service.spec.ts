import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { UserService } from './user.service';
import { Register } from '../models/Register';
import { Login } from '../models/Login';

describe('UserService', () => {

  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    // GIVEN
    const user: Register = {
      firstName: 'Jean',
      lastName: 'Dupont',
      login: 'jean',
      password: 'password'
    };

    const response = {
      message: 'User registered'
    };

    // WHEN
    service.register(user).subscribe(result => {
      // THEN
      expect(result).toEqual(response);
    });

    const request = httpTestingController.expectOne('/api/register');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);

    request.flush(response);
  });

  it('should login a user', () => {
    // GIVEN
    const user: Login = {
      login: 'jean',
      password: 'password'
    };

    const token = 'JWT_TOKEN';

    // WHEN
    service.login(user).subscribe(result => {
      // THEN
      expect(result).toBe(token);
    });

    const request = httpTestingController.expectOne('/api/login');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);
    expect(request.request.responseType).toBe('text');

    request.flush(token);
  });

});