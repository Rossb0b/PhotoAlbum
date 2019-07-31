import { Component, OnInit } from '@angular/core';

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
    ) { }

  ngOnInit() {
    this.initialize();
  }

  /**
   * Initialize the component;
   * Set the loading on true,
   * Get the userId of current logged in user,
   * Get all albums to list,
   * Set the loading on false,
   *
   * @returns {Promise<void>}
   * @memberof AlbumComponent
   */
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
    this.isLoading = false;
  }

  /**
   * Fetch a list of current albums that user can see
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
  }

  /**
   * Delete the selectionned album,
   * Refresh the list of albums that user can see
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
    this.isLoading = false;
  }
}
