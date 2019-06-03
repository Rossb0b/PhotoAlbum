import { Component, OnInit } from '@angular/core';
import { Album } from './../album.interface';
import { AlbumsService } from '../albums.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { User } from 'src/app/users/user.interface';
import { from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements OnInit {
  /** current album */
  album: Album;
  /** album id in url params used to retrieve album */
  private albumId: string;
  /** define if front is communicating with api */
  isLoading = false;
  /** album form */
  form: FormGroup;
  /** current list of all user */
  private users;
  /** formated array of users */
  private usersUpdated = new Subject<{ users: User[] }>();

  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    public albumsService: AlbumsService,
    public userService: UserService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.albumId = this.route.snapshot.params.albumId;

    try {
      this.album = await this.albumsService.getAlbum(this.albumId);
      console.log(this.album);
    } catch (e) {
      /** debbuging */
      console.error(e);

      this.router.navigateByUrl('/albums');
    }

    this.form.get('title').setValue(this.album.title);

    this.getUsers();
    // console.log(observable);
    // observable.subscribe(data => {
    //   console.log(data);
    // });

    this.isLoading = false;
  }

  async getUsers(): Promise<void> {
    try {
      this.users = await this.userService.getUsers();
    } catch (e) {
      /** debbuging */
      console.error(e);

      this.router.navigateByUrl('/albums');
    }

    const observable = from(this.users).subscribe(() => {
      return this.users;
    });
    this.users.map(user => {
      delete user.password;
      delete user.imagePath;
      delete user.email;
      return user;
    });
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  removeFriend(id: string): void {
    const index = this.album.linked_friendsId.indexOf(id);
    this.album.linked_friendsId.splice(index, 1);
  }

  async saveAlbum(): Promise<void> {
    this.isLoading = true;
    console.log(this.form.value);

    if (this.form.valid) {


      const friendId = this.form.value.friendId || null;

      /** TODO: make a mat-autocomplete wich display no-friends list */
      const isFriend = this.album.linked_friendsId.indexOf(friendId) > -1;
      if (friendId && !isFriend) {
        this.album.linked_friendsId.push(friendId);
      }


      this.album.title = this.form.get('title').value;

      // console.log(this.album);
      try {
        await this.albumsService.updateAlbum(this.album);
      } catch (e) {
        /** debbuging */
        console.error(e);
        alert('Server couldn\'t update album, try again later');
      }
    }

    this.form.reset();
    this.isLoading = false;
  }
}


