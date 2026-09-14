import { Observable, of } from 'rxjs';

import { Register } from '../models/Register';

export class UserMockService {

  register(user: Register): Observable<object> {
    return of(user);
  }
}