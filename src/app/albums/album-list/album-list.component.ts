import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Album } from '../album.interface';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit, OnDestroy {

  albums: Album[] = [];
  isLoading = false;
  userId: string;
  public userIsAuthenticated: boolean;
  private albumsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public albumsService: AlbumsService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.albumsService.getAlbums(this.userId);
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });
    this.albumsSub = this.albumsService.getAlbumUpdatedListener()
      .subscribe((albumData: { albums: Album[], albumCount: number }) => {
        const albumsForDate = albumData.albums;
        albumsForDate.forEach(album => {
          const dateOfAlbum = new Date(album.created_date);
          const dateMonth = dateOfAlbum.getMonth() + 1;
          let formatedDate: string;
          if (dateMonth >= 10) {
            formatedDate = dateMonth + '/' + dateOfAlbum.getFullYear();
          } else {
            formatedDate = '0' + dateMonth + '/' + dateOfAlbum.getFullYear();
          }
          album.created_date = formatedDate;
        });
        this.albums = albumsForDate;
        console.log(this.albums);
        this.isLoading = false;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
  }


  onShow(albumId: string) {
    localStorage.setItem('albumId', albumId);
    this.router.navigate(['/albums/myAlbum']);
  }

  onDelete(albumId: string, imageToDeletePath: any) {
    this.isLoading = true;
    this.albumsService.deleteAlbum(albumId).subscribe(() => {
      this.albumsService.getAlbums(this.userId);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.albumsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
