import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ConfirmEmail } from '../../models/account/confirm-email';
import { Login } from '../../models/account/login';
import { RegisterEmployee } from '../../models/account/register-employee';
import { RegisterManager } from '../../models/account/register-manager';
import { User } from '../../models/account/user';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();  // observable, meaning we can subscribe to it at any time

  constructor(private http: HttpClient,
    private router: Router) { }

  registerEmployee(model: RegisterEmployee) {
    return this.http.post<User>(`${environment.appUrl}/api/account/register-employee`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
          return user;
        }
        return null;
      })
    );
  }

  registerManager(model: RegisterManager) {
    return this.http.post<User>(`${environment.appUrl}/api/account/register-manager`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
          return user;
        }
        return null;
      })
    );
  }

  search(str: string) {
    return this.http.get(`${environment.appUrl}/api/account/search/${str}`, {});
  }

  confirmEmail(model: ConfirmEmail) {
    return this.http.put(`${environment.appUrl}/api/account/confirm-email`, model);
  }

  resendEmailConfirmationLink(email: string) {
    return this.http.post(`${environment.appUrl}/api/account/resend-email-confirmation-link/${email}`, {});
  }

  resetPassword(email: string) {
    return this.http.put(`${environment.appUrl}/api/account/reset-password/${email}`, {});
  }

  login(model: Login) {
    return this.http.post<User>(`${environment.appUrl}/api/account/login`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
          if (user.isManager) {
            this.router.navigateByUrl('/manager');
          }
          else {
            this.router.navigateByUrl('/employee');
          }
          return user;
        }
        return null;
      })
    );
  }

  logout() {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: User = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  getEmail() {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: User = JSON.parse(key);
      return user.email.toString();
    } else {
      return null;
    }
  }

  getIsManager() {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: User = JSON.parse(key);
      return user.isManager;
    } else {
      return null;
    }
  }

  refreshUser(jwt: string | null, email: string | null) {
    if (jwt === null || email === null) {
      this.userSource.next(null);
      return of(undefined);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this.http.get<User>(`${environment.appUrl}/api/account/refresh-user-token/${email}`, { headers }).pipe(
      take(1),
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  setUser(user: User) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user); // we store the user in the local storage in browser and in the angular app - to tell whether the user is logged in and keep him logged after refreshing page
  }
}
