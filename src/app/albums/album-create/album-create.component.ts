import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Album } from '../album.model';
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
export class AlbumCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';

  results = [];
  album: Album;
  private albumId: string;
  imagePreview = [];
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;
  filesToUpload: Array<File> = [];
  friendsShare: Array<string> = [];
  arrayOfFriends;
  newUserToShare: string;
  private errorMsg = false;
  @ViewChildren('checkbox') checkboxes;





  constructor(
    public albumsService: AlbumsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('albumId')) {
        this.mode = 'edit';
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
          this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
            friendsShare: new FormArray([]),
            friendId: new FormControl(null)
          });
          this.friendsShare = this.album.linked_friendsId;
          this.addCheckboxes();
          this.checkboxes.changes.subscribe(() => {
            this.checkboxes.toArray().forEach(el => {
              if (el.nativeElement.type === 'checkbox') {
                  el.nativeElement.checked = false;
              }
            });
          });
          this.form.setValue({
            title: this.album.title,
            friendsShare: this.friendsShare,
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

  private addCheckboxes() {
    this.friendsShare.map((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.friendsShare as FormArray).push(control);
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
    this.isLoading = true;
    if (this.mode === 'create') {
      this.albumsService.addAlbum(
        this.form.value.title,
        this.filesToUpload
        );
    } else {
      this.arrayOfFriends = this.album.linked_friendsId;
      if (this.form.value.friendId) {
        this.newUserToShare = this.form.value.friendId;
        const formTitle = this.form.value.title;
        let userIsAlreadyInList = false;
        for (let i = 0; i < this.arrayOfFriends.length; i++) {
          console.log(this.newUserToShare);
          console.log(this.arrayOfFriends[i]);
          if (this.newUserToShare === this.arrayOfFriends[i]) {
            userIsAlreadyInList = true;
          }
        }
        console.log(userIsAlreadyInList);
        if (userIsAlreadyInList !== true) {
          this.userService.checkUser(this.newUserToShare).then(response => {
            response.subscribe(data => {
              console.log(data);
              if (data) {
                this.arrayOfFriends.push(data._id);
              }
              
              for (let i = 0; i <= this.form.value.friendsShare.length - 1; i++) {
                if (this.form.value.friendsShare[i] === true) {
                  for (let j = 0; j <= this.arrayOfFriends.length - 1; j++) {
                    if (this.arrayOfFriends[j] === this.friendsShare[i]) {
                      this.arrayOfFriends.splice(j , 1);
                      i = i - 1;
                    }
                  }
                }
              }
              
              this.albumsService.updateAlbum({
                id: this.albumId,
                title: formTitle,
                creator: this.album.creator,
                imagePath: this.album.imagePath,
                linked_friendsId: this.arrayOfFriends,
                created_date: this.album.created_date
              });
              this.isLoading = false;
            })
          });
        } else {
          this.isLoading = false;
          this.form.reset();
        }
      } else {
        for (let i = 0; i <= this.form.value.friendsShare.length - 1; i++) {
          if (this.form.value.friendsShare[i] === true) {
            for (let j = 0; j <= this.arrayOfFriends.length - 1; j++) {
              if (this.arrayOfFriends[j] === this.friendsShare[i]) {
                this.arrayOfFriends.splice(j , 1);
                i = i - 1;
              }
            }
          }
        }

        this.albumsService.updateAlbum({
          id: this.albumId,
          title: this.form.value.title,
          creator: this.album.creator,
          imagePath: this.album.imagePath,
          linked_friendsId: this.arrayOfFriends,
          created_date: this.album.created_date
        });
        this.isLoading = false;
      }
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
