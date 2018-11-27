import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserName() {
    return localStorage.getItem('nickname');
  }

  createUser(
    email: string,
    password: string,
    nickname: string,
    currentWeight: number
  ) {
    const user: AuthData = {
      email: email,
      password: password,
      nickname: nickname,
      startWeight: currentWeight
    };
    this.http
      .post('http://localhost:3000/api/user/signup', user)
      .subscribe(response => {
        this.router.navigate(['/login']);
      });
  }

  login(email: string, password: string) {
    const user: AuthData = {
      email: email,
      password: password,
      nickname: null,
      startWeight: null
    };
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        nickname: string;
        startWeight: number;
      }>('http://localhost:3000/api/user/login', user)
      .subscribe(response => {
        console.log(response);
        this.token = response.token;
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationData = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(
            response.token,
            expirationData,
            response.nickname,
            response.startWeight
          );
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    nickname: string,
    startWeight: number
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('startWeight', startWeight.toString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('nickname');
    localStorage.removeItem('startWeight');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
