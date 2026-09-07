import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([authInterceptor])
        ),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should add Bearer token when token exists', () => {
    // GIVEN
    localStorage.setItem('token', 'JWT_TOKEN');

    // WHEN
    httpClient.get('/api/test').subscribe();

    const request =
      httpTestingController.expectOne('/api/test');

    // THEN
    expect(
      request.request.headers.get('Authorization')
    ).toBe('Bearer JWT_TOKEN');

    request.flush({});
  });

  it('should not add Authorization header when token does not exist', () => {
    // WHEN
    httpClient.get('/api/test').subscribe();

    const request =
      httpTestingController.expectOne('/api/test');

    // THEN
    expect(
      request.request.headers.has('Authorization')
    ).toBe(false);

    request.flush({});
  });

});