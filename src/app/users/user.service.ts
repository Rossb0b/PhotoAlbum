import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Observable } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private error: string;
  private userExist: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      email: string;
      firstname: string;
      lastname: string;
      imagePath: string;
    }>(BACKEND_URL + id);
  }

  // checkUser(id: string): boolean {
  //   this.getUser(id).subscribe(response => {
  //     console.log(response);
  //     if (response) {
  //       this.userExist = true;
  //     } else {
  //       this.userExist = false;
  //     }
  //   })
  //   console.log(this.userExist);
  //   return this.userExist;
  // }

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
      this.http.put(BACKEND_URL + id, userData)
        .subscribe(response => {
            this.router.navigate(['/']);
        });
    } else {
      return this.error = 'Form is invalid';
    }
  }

}
