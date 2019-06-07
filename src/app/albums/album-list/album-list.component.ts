import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Album } from '../album.interface';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  /** define if front is communicating with api */
  isLoading: boolean;
  /** Current list of albums */
  albums: Album[] = [];
  /** Current ID of logged in user */
  userId: string;

  constructor(
    public albumsService: AlbumsService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.isLoading = true;

    try {
      this.userId = await this.authService.getUserId();
    } catch(e) {
      /** debbuging */
      console.error(e);
      alert('checking userId failed');
    }

    this.getAlbums();
    this.isLoading = false;
  }

  async getAlbums(): Promise<void> {
    try {
      this.albums = await this.albumsService.getAlbums(this.userId);
    } catch(e) {
      /** debbuging */
      console.error(e);
      alert('fetching albums failed');
    }
  }

  onShow(albumId: string) {
    localStorage.setItem('albumId', albumId);
    this.router.navigate(['/albums/myAlbum']);
  }

  async deleteAlbum(albumId: string): Promise<void> {
    this.isLoading = true;

    try {
      await this.albumsService.deleteAlbum(albumId);
    } catch(e) {
      /** debbuging */
      console.error(e);
      alert('Server couldn\'t delete album');
    }

    this.getAlbums();
    this.isLoading = false;
  }
}
