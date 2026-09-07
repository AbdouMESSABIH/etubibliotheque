import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([])
      ]
    });

    router = TestBed.inject(Router);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when token exists', () => {
    // GIVEN
    localStorage.setItem('token', 'JWT_TOKEN');

    // WHEN
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    // THEN
    expect(result).toBe(true);
  });

  it('should redirect to login when token does not exist', () => {
    // WHEN
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    // THEN
    expect(result).toBeInstanceOf(UrlTree);

    const url = router.serializeUrl(result as UrlTree);

    expect(url).toBe('/login');
  });

});