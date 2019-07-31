import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { environment } from '@env/environment';
import { AuthData } from '@interface/auth-data.interface';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
      return this.isAuthenticated;
    }

    getUserId() {
      return this.userId;
    }

    getAuthStatusListener() {
      return this.authStatusListener.asObservable();
    }

    /**
     * Request to create a new User.
     *
     * @param email
     * @param password
     * @param firstname
     * @param lastname
     * @memberof AuthService
     */
    createUser(email: string, password: string, firstname: string, lastname: string) {
        const user = {email, password, firstname, lastname};
        this.http.post(BACKEND_URL + 'signup', user).subscribe(() => {
          this.router.navigate(['/']);
        }, error => {
          this.authStatusListener.next(false);
        });
    }

    /**
     * Request to login.
     * If success,
     * Create the token,
     * Set user authentification status on true,
     * Set the userId,
     * Redirect the user,
     *
     * @param email
     * @param password
     * @memberof AuthService
     */
    login(email: string, password: string) {
        const authData: AuthData = {email, password};
        this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + 'login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                  const expiresInDuration = response.expiresIn;
                  this.setAuthTimer(expiresInDuration);
                  this.isAuthenticated = true;
                  this.userId = response.userId;
                  this.authStatusListener.next(true);
                  const now = new Date();
                  const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                  this.saveAuthData(token, expirationDate, this.userId);
                  this.router.navigate(['/']);
                }
            }, error => {
              this.authStatusListener.next(false);
            });
    }

    /**
     * Check if user is already connected.
     *
     * @memberof AuthService
     */
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
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }

    /**
     * Disconnect the user
     *
     * @memberof AuthService
     */
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.clearAuthData();
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/auth/login']);
    }

    /**
     * Define how much time the user can be connected.
     *
     * @param duration
     * @memberof AuthService
     */
    private setAuthTimer(duration: number) {
      console.log('Setting timer: ' + duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    /**
     * Save data of the user connection into the localStorage.
     *
     * @param token
     * @param expirationDate
     * @param userId
     * @memberof AuthService
     */
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
    }

    /**
     * Delete data of the user connected.
     *
     * @memberof AuthService
     */
    private clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
    }

    /**
     * Return data of the user connected if exist.
     *
     * @private
     * @returns
     * @memberof AuthService
     */
    private getAuthData() {
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId');
      if (!token || !expirationDate || !userId) {
        return;
      }
      return {
        token,
        expirationDate: new Date(expirationDate),
        userId
      };
    }
}
