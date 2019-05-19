import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Album } from './album.model';

const BACKEND_URL = environment.apiUrl + '/albums/';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  private albums: Album[] = [];
  private albumsUpdated = new Subject<{ albums: Album[], albumCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getAlbums(userId: string) {
    const queryParams = `?userId=${userId}`;
    this.http
      .get<{ message: string, albums: any, maxAlbums: number }>(BACKEND_URL + queryParams)
      .pipe(
          map((albumData) => {
            return {
              // tslint:disable-next-line: max-line-length
              albums: albumData.albums.map((album: { _id: string; title: string; imagesPath: []; creator: string; created_date: Date; }) => {
                return {
                  imagesPath: album.imagesPath,
                  id: album._id,
                  title: album.title,
                  creator: album.creator,
                  created_date: album.created_date
                };
              }), maxAlbums: albumData.maxAlbums
            };
          })
      )
      .subscribe(transformedAlbumData => {
        this.albums = transformedAlbumData.albums;
        this.albumsUpdated.next({
          albums: [...this.albums],
          albumCount: transformedAlbumData.maxAlbums
      });
   });
  }

  getAlbumUpdatedListener() {
    return this.albumsUpdated.asObservable();
  }

  getAlbum(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagesPath: [];
      creator: string;
      created_date: string;
    }>(BACKEND_URL + id);
  }

  addAlbum(title: string, images: any) {
    const albumData = new FormData();
    const files: Array<File> = images;
    albumData.append('title', title);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      albumData.append('uploads[]', files[i], title);
    }
    this.http.post<{message: string, album: Album}>(BACKEND_URL, albumData)
      .subscribe(() => {
        this.router.navigate(['/albums']);
      });
  }

  deleteAlbum(albumId: string) {
    return this.http.delete(BACKEND_URL + albumId);
  }

  updateAlbum({
    id,
    title,
    creator,
    imagePath,
    created_date }: { id: string; title: string; creator: string; imagePath: any; created_date: any; }) {
    let albumData: Album | FormData;
    albumData = new FormData();
    albumData.append('id', id);
    albumData.append('title', title);
    albumData.append('creator', creator);
    albumData.append('imagePath', imagePath);
    albumData.append('created_date', created_date);
    this.http.put(BACKEND_URL + id, albumData)
      .subscribe(() => {
        this.router.navigate(['/albums']);
      });
  }

  // tslint:disable-next-line: variable-name
  addPhoto(id: string, title: string, creator: string, imagePath: any, created_date: any, imageToAddPath: string) {
    let albumData: Album | FormData;
    albumData = new FormData();
    const onAdd = 'true';
    albumData.append('id', id);
    albumData.append('title', title);
    albumData.append('creator', creator);
    albumData.append('imagePath', imagePath);
    albumData.append('created_date', created_date);
    albumData.append('image', imageToAddPath, title);
    albumData.append('onAdd', onAdd);
    this.http.put(BACKEND_URL + id, albumData)
      .subscribe(() => {
        localStorage.setItem('albumId', id);
        this.router.navigate(['/yourAlbum']);
      });
  }

  // tslint:disable-next-line: variable-name
  deletePhoto(id: string, title: string, creator: string, imagePath: any, created_date: any, imageToDeletePath: string) {
    let albumData: Album | FormData;
    albumData = new FormData();
    albumData.append('id', id);
    albumData.append('title', title);
    albumData.append('creator', creator);
    albumData.append('imagePath', imagePath);
    albumData.append('created_date', created_date);
    albumData.append('imageToDeletePath', imageToDeletePath);
    this.http.put(BACKEND_URL + id, albumData)
      .subscribe(() => {
        localStorage.setItem('albumId', id);
        this.router.navigate(['/yourAlbum']);
      });
  }
}
