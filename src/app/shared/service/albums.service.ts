import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { Album } from '../interface/album.interface';
import { environment as env } from '@env/environment';
import { User } from '../interface/user.interface';

const BACKEND_URL = env.apiUrl + '/albums/';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  /** current list of album fetched */
  private albums: Album[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Request every album the actual user can see.
   *
   * @param {string} userId
   * @returns {Promise <any>}
   * @memberof AlbumsService
   */
  getAlbums(userId: string): Promise <any> {
    const queryParams = `?userId=${userId}`;
    return this.http.get(BACKEND_URL + queryParams).toPromise();
  }

  /**
   * Request the album the user choose.
   *
   * @param {string} id
   * @returns {Promise<Album>}
   * @memberof AlbumsService
   */
  getAlbum(id: string): Promise<any> {
    return this.http.get<{album: Album, users: User[]}>(BACKEND_URL + id).toPromise();
  }

  /**
   * Request to create a new album.
   *
   * @param {string} title
   * @param {*} images
   * @returns {Promise<any>}
   * @memberof AlbumsService
   */
  addAlbum(title: string, images: any): Promise<any> {
    const albumData = new FormData();
    const files: Array<File> = images;
    albumData.append('title', title);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      albumData.append('uploads[]', files[i], title);
    }
    return this.http.post<{message: string, album: Album}>(BACKEND_URL, albumData).toPromise();
  }

  /**
   * Request to delete the album selectionned.
   *
   * @param {string} albumId
   * @returns {Promise<any>}
   * @memberof AlbumsService
   */
  deleteAlbum(albumId: string): Promise<any> {
    return this.http.delete(BACKEND_URL + albumId).toPromise();
  }

  /**
   * Request to update the album selectionned.
   *
   * @param {Album} album
   * @returns {Promise<any>}
   * @memberof AlbumsService
   */
  updateAlbum(album: Album): Promise<any> {
    return this.http.put(BACKEND_URL + album._id, album).toPromise();
  }

  /**
   * Request to upload a new image to the album selectionned.
   *
   * @param {Album} album
   * @param {string} imageToAdd
   * @returns {Promise<any>}
   * @memberof AlbumsService
   */
  addPhoto(
    album: Album,
    imageToAdd: string
    ): Promise<any> {
    const albumData = new FormData();
    const onAdd = 'true';
    albumData.append('_id', album._id);
    albumData.append('title', album.title);
    albumData.append('userId', album.userId);
    album.images.forEach(image => {
      albumData.append('imagesPath[]', image.path);
      albumData.append('imagesAlt[]', image.alt);
    });
    albumData.append('created_date', album.created_date);
    albumData.append('image', imageToAdd, album.title);
    albumData.append('onAdd', onAdd);


    return this.http.put(BACKEND_URL + album._id, albumData).toPromise();
  }

  /**
   * Request to delete the selectionned photo from the selectionned album.
   *
   * @param {Album} album
   * @param {string} imageToDeletePath
   * @returns {Promise<any>}
   * @memberof AlbumsService
   */
  deletePhoto(album: Album, imageToDeletePath: string): Promise<any> {
    const albumData = new FormData();
    albumData.append('_id', album._id);
    albumData.append('title', album.title);
    albumData.append('userId', album.userId);
    album.images.forEach(image => {
      albumData.append('imagesPath[]', image.path);
      albumData.append('imagesAlt[]', image.alt);
    });
    albumData.append('created_date', album.created_date);
    albumData.append('imageToDeletePath', imageToDeletePath);

    return this.http.put(BACKEND_URL + album._id, albumData).toPromise();
  }
}
