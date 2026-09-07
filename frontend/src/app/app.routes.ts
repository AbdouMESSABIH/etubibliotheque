import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {AppComponent} from './app.component';
import { StudentsComponent } from './pages/students/students.component';
import { authGuard } from './core/guard/auth.guard';
import { StudentCreateComponent } from './pages/student-create/student-create.component';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { StudentEditComponent } from './pages/student-edit/student-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'students', component: StudentsComponent, canActivate: [authGuard] },
  { path: 'students/new', component: StudentCreateComponent, canActivate: [authGuard] },
  { path: 'students/:id', component: StudentDetailComponent, canActivate: [authGuard] },
  { path: 'students/:id/edit', component: StudentEditComponent, canActivate: [authGuard] },
];