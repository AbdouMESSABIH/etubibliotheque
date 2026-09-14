import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

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

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    // WHEN
    const result = TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    );

    // THEN
    expect(result).toBe(true);
  });

  it('should redirect to login when token does not exist', () => {
    // GIVEN
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    // WHEN
    const result = TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    );

    // THEN
    expect(result).toBeInstanceOf(UrlTree);

    const url = router.serializeUrl(result as UrlTree);

    expect(url).toBe('/login');
  });

});