import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user: {_id: string, email: string, firstname: string, lastname: string, imagePath: string};
  isLoading = false;
  userId: string;
  form: FormGroup;
  imagePreview: string;
  public userIsAuthenticated: boolean;
  private authStatusSub: Subscription;
  private userSub: Subscription;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.form = new FormGroup({
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.userSub = this.userService.getUser(this.userId).subscribe((userData: {
      _id: string,
      email: string,
      firstname: string,
      lastname: string,
      imagePath: string}) => {
      this.isLoading = false;
      this.user = userData;
      this.form.setValue({
        'image': ''
      });
    });
  }

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

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = false;
    this.userService.updateUser(
      this.userId,
      this.user.email,
      this.user.firstname,
      this.user.lastname,
      this.form.value.image,
      this.user.imagePath
      );
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
