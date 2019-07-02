import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Album } from '@interface/album.interface';
import { AlbumsService } from '@service/albums.service';
import { AuthService } from '@service/auth.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

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
    } catch (e) {
      /** debbuging */
      console.error(e);
      alert('checking userId failed');
    }

    this.getAlbums();
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof AlbumListComponent
   */
  async getAlbums(): Promise<void> {
    try {
      this.albums = await this.albumsService.getAlbums(this.userId);
    } catch (e) {
      /** debbuging */
      console.error(e);
      alert('fetching albums failed');
    }

    this.isLoading = false;
  }

  /**
   *
   *
   * @param {string} albumId
   * @returns {Promise<void>}
   * @memberof AlbumListComponent
   */
  async deleteAlbum(albumId: string): Promise<void> {
    this.isLoading = true;

    try {
      await this.albumsService.deleteAlbum(albumId);
    } catch (e) {
      /** debbuging */
      console.error(e);
      alert('Server couldn\'t delete album');
    }

    this.getAlbums();
  }
}
