import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthService } from '@service/auth.service';
import { UserService } from '@service/user.service';
import { mimeType } from '@helper/validator/mime-type.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user;
  isLoading = false;
  userId: string;
  form: FormGroup;
  imagePreview: any;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.initialize();
  }

  /**
   * Initialize the component.
   * Set loading on true,
   * Get the id of current logged in user,
   * Idenfity the user,
   * Build form to edit user,
   * Set loading on false,
   *
   * @returns {Promise<void>}
   * @memberof UserProfileComponent
   */
  async initialize(): Promise<void> {
    this.isLoading = true;

    this.userId = this.authService.getUserId();

    try {
      this.user = await this.userService.getUser(this.userId);
    } catch (e) {
      console.error(e);
    }

    this.buildForm();

    this.isLoading = false;
  }

  /**
   * Set the form to edit the User.
   *
   * @memberof UserProfileComponent
   */
  buildForm(): void {
    this.form = new FormGroup({
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  /**
   * Function called after the user picked avatar.
   * Read the file to upload, check his format,
   * If format is valid, push the image source define it to the imagePreview,
   *
   * @param event
   * @memberof UserProfileComponent
   */
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Function called to edit the user.
   * Set loading on true,
   * Check the form,
   * Update the user, if success, redirect,
   * If not, reset the form,
   * Set loading on false,
   *
   * @memberof UserProfileComponent
   */
  async SaveUser(): Promise<void> {
    this.isLoading = true;

    if (this.form.invalid) {
      return;
    }

    try {
      await this.userService.updateUser(
        this.userId,
        this.user.email,
        this.user.firstname,
        this.user.lastname,
        this.user.password,
        this.user.imagePath,
        this.form.value.image,
        );

      this.router.navigate(['/']);
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.form.reset();

    this.isLoading = false;
  }
}
