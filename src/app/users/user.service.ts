import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User } from './user.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BACKEND_URL = environment.apiUrl + '/user/';
  private error: string;
  private userExist: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  async getUser(id: string): Promise<User> {
    return this.http.get<User>(this.BACKEND_URL + id).toPromise();
  }

  getUsers() {
    return this.http.get(this.BACKEND_URL).toPromise();
  }

  async checkUser(id: string) {
    return await this.isUserExisting(id);
  }

  isUserExisting(id: string) {
    return Promise.resolve(this.getUser(id));
  }

  updateUser(id: string, email: string, firstname: string, lastname: string, image: File | string, imagePath: string) {
    let userData: User | FormData;
    if (typeof(image) === 'object') {
      userData = new FormData();
      userData.append('id', id);
      userData.append('email', email);
      userData.append('firstname', firstname);
      userData.append('lastname', lastname);
      userData.append('image', image, id);
      userData.append('imagePath', imagePath);
      this.http.put(this.BACKEND_URL + id, userData)
        .subscribe(response => {
            this.router.navigate(['/']);
        });
    } else {
      return this.error = 'Form is invalid';
    }
  }

}
