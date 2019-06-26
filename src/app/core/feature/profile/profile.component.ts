import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../core/shared/service/user.service';
import { mimeType } from 'src/app/core/shared/helper/validator/mime-type.validator';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user;
  isLoading = false;
  userId: string;
  form: FormGroup;
  imagePreview: any;
  public userIsAuthenticated: boolean;
  private authStatusSub: Subscription;

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
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.initialize();
  }

  async initialize(): Promise<void>
  {
    try {
      this.user = await this.userService.getUser(this.userId);
    } catch(e) {
      console.error(e);
    }

    this.isLoading = false;
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
}
