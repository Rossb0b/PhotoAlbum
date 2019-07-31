import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '@interface/user.interface';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BACKEND_URL = environment.apiUrl + '/user/';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Request to get data of the user selectionned.
   *
   * @param id
   * @returns {Promise<User>}
   * @memberof UserService
   */
  async getUser(id: string): Promise<User> {
    return this.http.get<User>(this.BACKEND_URL + id).toPromise();
  }

  /**
   * Requestion to get data of every users.
   *
   * @returns {Promise<any>}
   * @memberof UserService
   */
  async getUsers(): Promise<any> {
    return this.http.get(this.BACKEND_URL).toPromise();
  }

  /**
   * Check if the user exist.
   *
   * @param id
   * @memberof UserService
   */
  async checkUser(id: string) {
    return await this.isUserExisting(id);
  }

  /**
   * Try to get this User.
   *
   * @param {string} id
   * @returns
   * @memberof UserService
   */
  isUserExisting(id: string) {
    return Promise.resolve(this.getUser(id));
  }

  /**
   * Request to update update the logged in user.
   *
   * @param id
   * @param email
   * @param firstname
   * @param lastname
   * @param password
   * @param imagePath
   * @param image
   * @returns {Promise<any>}
   * @memberof UserService
   */
  async updateUser(
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    imagePath: string,
    image: File | string): Promise<any> {
    let userData: User | FormData;

    if (typeof(image) === 'object') {
      userData = new FormData();
      userData.append('id', id);
      userData.append('email', email);
      userData.append('firstname', firstname);
      userData.append('lastname', lastname);
      userData.append('password', password);
      userData.append('imagePath', imagePath);
      userData.append('image', image, id);

      return this.http.put(this.BACKEND_URL + id, userData).toPromise();
    }
  }

}
