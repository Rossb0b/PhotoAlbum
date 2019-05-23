import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Album } from '../album.model';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrls: ['./album-create.component.css']
})
export class AlbumCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  results = [];
  album: Album;
  private albumId: string;
  imagePreview: string;
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;
  filesToUpload: Array<File> = [];



  constructor(public albumsService: AlbumsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('albumId')) {
        this.mode = 'edit';
        this.form = new FormGroup({
          title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
          friendId: new FormControl(null)
        });
        console.log(this.form);
        this.albumId = paramMap.get('albumId');
        this.isLoading = true;
        this.albumsService.getAlbum(this.albumId).subscribe(albumData => {
          this.isLoading = false;
          this.album = {
            id: albumData._id,
            title: albumData.title,
            imagePath: albumData.imagesPath,
            linked_friendsId: albumData.linked_friendsId,
            creator: albumData.creator,
            created_date: albumData.created_date,
          };
          console.log(this.album);
          this.form.setValue({
            title: this.album.title,
            friendId: null
          });
        });
      } else {
        this.mode = 'create';
        this.albumId = null;
        this.form = new FormGroup({
          title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(18)]}),
          image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
        });
      }
    });
  }

  onImagePicked(event: Event) {
    this.filesToUpload = (event.target as HTMLInputElement).files as unknown as Array<File>;
    // const fileList = this.filesToUpload.length;
    // const arrayOfFile = [];
    // for (let i = 0; i <= fileList; i++) {
    //   arrayOfFile.push(this.filesToUpload[i]);
    // }
    // this.form.patchValue({image: arrayOfFile});
    // this.form.get('image').updateValueAndValidity();
  }

  onSaveAlbum() {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.albumsService.addAlbum(
        this.form.value.title,
        this.filesToUpload
        );
    } else {
      const arrayOfFriends = this.album.linked_friendsId;
      arrayOfFriends.push(this.form.value.friendId);
      this.albumsService.updateAlbum({
        id: this.albumId,
        title: this.form.value.title,
        creator: this.album.creator,
        imagePath: this.album.imagePath,
        linked_friendsId: arrayOfFriends,
        created_date: this.album.created_date
      });
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
