import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Album } from './../album.interface';
import { AlbumsService } from '../albums.service';
import { UserService } from 'src/app/users/user.service';
import { AuthService } from 'src/app/auth/auth.service';

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
  /** Current ID of logged in user */
  userId: string;
  /** define if front is communicating with api */
  isLoading = false;
  /** album form */
  form: FormGroup;
  /** current list of all user */
  private users;
  /** current list of all user with filtered data */
  private filteredUsers: {_id: string, firstname: string, lastname: string}[];


  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    public albumsService: AlbumsService,
    public authService: AuthService,
    public userService: UserService,
  ) {
    this.buildForm();
    this.users = this.form.get('friendId').valueChanges
    .pipe(
      startWith(''),
      map((user) => this.filterFriend(user)),
    );
  }

  ngOnInit() {
    this.initialize();
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof AlbumEditComponent
   */
  async initialize(): Promise<void> {
    this.albumId = this.route.snapshot.params.albumId;

    try {
      this.userId = await this.authService.getUserId();
      this.album = await this.albumsService.getAlbum(this.albumId);
    } catch (e) {
      /** debbuging */
      console.error(e);

      this.router.navigateByUrl('/albums');
    }

    this.form.get('title').setValue(this.album.title);

    this.getUsers();

    this.isLoading = false;
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof AlbumEditComponent
   */
  async getUsers(): Promise<void> {
    try {
      this.users = await this.userService.getUsers();

      for (let i = 0; i < this.users.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.album.linked_friendsId.length; j++) {
          if (this.users[i]._id === this.album.linked_friendsId[j]) {
            this.users.splice(i, 1);
            i--;
          }
        }
      }
    } catch (e) {
      /** debbuging */
      console.error(e);

      this.router.navigateByUrl('/albums');
    }

    const observable = from(this.users).subscribe(() => {
      this.filteredUsers = [];
      const userLength = this.users.length;
      for (let i = 0; i < userLength; i++) {
        if (this.users[i]._id !== this.userId) {
          const user = { _id: this.users[i]._id, firstname: this.users[i].firstname, lastname: this.users[i].lastname };
          this.filteredUsers.push(user);
        }
      }
    });
  }

  /**
   * filter users with input value for autocomplete
   *
   * @param {string} value
   * @returns {string[]}
   */
  filterFriend(value: string): string[] {
    if (!value) {
      value = '';
    }
    const filterValue = value.toLowerCase();

    return this.users.filter((user) => user.toLowerCase().includes(filterValue));
  }

  /**
   *
   *
   * @memberof AlbumEditComponent
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(4)]],
      friendId: null
    });
  }

  /**
   *
   *
   * @param {string} id
   * @memberof AlbumEditComponent
   */
  removeFriend(id: string): void {
    const index = this.album.linked_friendsId.indexOf(id);
    this.album.linked_friendsId.splice(index, 1);
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof AlbumEditComponent
   */
  async saveAlbum(): Promise<void> {
    this.isLoading = true;

    if (this.form.valid) {


      const friendId = this.form.value.friendId || null;

      /** TODO: make a mat-autocomplete wich display no-friends list */
      const isFriend = this.album.linked_friendsId.indexOf(friendId) > -1;
      if (friendId && !isFriend) {
        this.album.linked_friendsId.push(friendId);
      }


      this.album.title = this.form.get('title').value;

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


