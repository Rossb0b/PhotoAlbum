import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Album } from '../album.interface';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrls: ['./album-create.component.css']
})
export class AlbumCreateComponent implements OnInit {

  album: Album;
  imagePreview = [];
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;
  filesToUpload: Array<File> = [];

  constructor(
    public albumsService: AlbumsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(18)]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  onImagePicked(event: Event) {
    this.filesToUpload = (event.target as HTMLInputElement).files as unknown as Array<File>;
    this.imagePreview = [];
    const fileList = this.filesToUpload.length;
    for (let i = 0; i <= fileList - 1; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result.toString();
        if (result.startsWith('data:image/jpeg') || result.startsWith('data:image/jpg') || result.startsWith('data:image/png')) {
          this.imagePreview.push(reader.result);
        }
      };
      reader.readAsDataURL(this.filesToUpload[i]);
    }
  }

  onSaveAlbum() {
    console.log(this.form.valid);
    this.isLoading = true;
    this.albumsService.addAlbum(
      this.form.value.title,
      this.filesToUpload
    );

    this.form.reset();
  }
}
