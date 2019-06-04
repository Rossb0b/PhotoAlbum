import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment as env } from '../../environments/environment';
import { Album } from './album.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  private albums: Album[] = [];
  private albumsUpdated = new Subject<{ albums: Album[], albumCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getAlbums(userId: string): Promise <any> {
    const queryParams = `?userId=${userId}`;
    return this.http.get(env.apiUrl + '/albums/' + queryParams).toPromise();
  }

  // getAlbums(userId: string) {
  //   const queryParams = `?userId=${userId}`;
  //   this.http
  //     .get<{ message: string, albums: any, maxAlbums: number }>(env.apiUrl + '/albums/' + queryParams)
  //     .pipe(
  //         map((albumData) => {
  //           return {
  //             // tslint:disable-next-line: max-line-length
  //             albums: albumData.albums.map((album: { _id: string; title: string; images: [{path: string, alt: string}]; linked_friendsId: []; creator: string; created_date: Date; }) => {
  //               return {
  //                 id: album._id,
  //                 title: album.title,
  //                 images: album.images,
  //                 linked_friendsId: album.linked_friendsId,
  //                 creator: album.creator,
  //                 created_date: album.created_date
  //               };
  //             }), maxAlbums: albumData.maxAlbums
  //           };
  //         })
  //     )
  //     .subscribe(transformedAlbumData => {
  //       this.albums = transformedAlbumData.albums;
  //       this.albumsUpdated.next({
  //         albums: [...this.albums],
  //         albumCount: transformedAlbumData.maxAlbums
  //     });
  //  });
  // }

  getAlbumUpdatedListener() {
    return this.albumsUpdated.asObservable();
  }



  getAlbum(id: string): Promise<Album> {
    return this.http.get<Album>(env.apiUrl + '/albums/' + id).toPromise();
  }

  addAlbum(title: string, images: any): Promise<any> {
    const albumData = new FormData();
    const files: Array<File> = images;
    albumData.append('title', title);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      albumData.append('uploads[]', files[i], title);
    }
    return this.http.post<{message: string, album: Album}>(env.apiUrl + '/albums/', albumData).toPromise();
  }

  deleteAlbum(albumId: string): Promise<any> {
    return this.http.delete(env.apiUrl + '/albums/' + albumId).toPromise();
  }

  updateAlbum(album: Album): Promise<any> {
    console.log(album);
    return this.http.put(env.apiUrl + '/albums/' + album._id, album).toPromise();
  }

  // tslint:disable-next-line: variable-name
  addPhoto(_id: string, title: string, creator: string, imagePath: any, created_date: any, imageToAddPath: string): Promise<any> {
    let albumData: Album | FormData;
    // mData.append('image', imageToAddPath, title);
    // albumData = new FormData();
    const onAdd = 'true';
    const queryParams = [albumData, onAdd];
    // albumData.append('id', id);
    // albumData.append('title', title);
    // albumData.append('creator', creator);
    // albumData.append('imagePath', imagePath);
    // albumData.append('created_date', created_date);
    // albumData.append('image', imageToAddPath, title);
    // albumData.append('onAdd', onAdd);
    return this.http.put(env.apiUrl + '/albums/' + _id, queryParams).toPromise();
  }

  // tslint:disable-next-line: variable-name
  deletePhoto(_id: string, title: string, creator: string, imagePath: any, created_date: any, imageToDeletePath: string): Promise<any> {
    let albumData: Album | FormData;
    const imageToDelete = imageToDeletePath;
    const queryParams = [albumData, imageToDelete];
    // albumData.append('id', id);
    // albumData.append('title', title);
    // albumData.append('creator', creator);
    // albumData.append('imagePath', imagePath);
    // albumData.append('created_date', created_date);
    // albumData.append('imageToDeletePath', imageToDeletePath);
    return this.http.put(env.apiUrl + '/albums/' + _id, albumData).toPromise();
  }
}
