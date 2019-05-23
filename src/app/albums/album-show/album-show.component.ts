import { Component, OnInit } from '@angular/core';
import { Subscription, empty } from 'rxjs';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Album } from '../album.model';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';
import { PageEvent } from '@angular/material';
import { ArticleService } from '../article/article.service';
import { Article } from '../article/article.model';

@Component({
  selector: 'app-album-show',
  templateUrl: './album-show.component.html',
  styleUrls: ['./album-show.component.css']
})
export class AlbumShowComponent implements OnInit {

  isLoading = false;
  albumId: string;
  album: Album;
  article: Article;
  userId: string;
  articleId: string;
  articleExist = false;

  newArrayOfImage: any;
  totalPhotos = 0;
  photosPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 2, 4];
  photosToDisplay = [];
  public userIsAuthenticated: boolean;
  private authStatusSub: Subscription;
  form: FormGroup;
  imagePreview: any;
  addPhoto = false;

  constructor(
    private authService: AuthService,
    private albumsService: AlbumsService,
    private articleService: ArticleService,
    private router: Router
    ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.userId = this.authService.getUserId();
    this.albumId = localStorage.getItem('albumId');
    localStorage.removeItem('albumId');
    if (this.albumId !== null) {
        this.isLoading = true;
        this.form = new FormGroup({
          image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
        });
        this.articleService.getArticleFromAlbumId(this.albumId).subscribe(articleData => {
          if ( Object.entries(articleData).length > 0) {
            this.articleExist = true;
            this.articleId = articleData.id;
          }
        });
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
          this.totalPhotos = this.album.imagePath.length;
          for (let i = 0; i <= this.photosPerPage - 1; i++) {
            if (this.album.imagePath[i]) {
              this.photosToDisplay.push(this.album.imagePath[i]);
            }
          }
        });
      } else {
        this.router.navigate(['/albums']);
      }
  }

  onAdd() {
    if (this.addPhoto === false) {
      this.addPhoto = true;
    } else {
      this.addPhoto = false;
    }
  }

  onShow(albumId: string) {
    localStorage.setItem('albumId', albumId);
    this.router.navigate(['/albums/myAlbum/Article']);
  }

  onAddArticle(albumId: string) {
    localStorage.setItem('albumId', albumId);
    this.router.navigate(['/albums/myAlbum/newArticle']);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.addPhoto = false;
    this.imagePreview = '';
    this.currentPage = pageData.pageIndex + 1;
    this.photosPerPage = pageData.pageSize;
    this.photosToDisplay = [];
    const newIndex = this.photosPerPage * pageData.pageIndex;
    for (let i = newIndex; i <= newIndex + this.photosPerPage - 1; i++) {
      if (this.album.imagePath[i]) {
        this.photosToDisplay.push(this.album.imagePath[i]);
      }
    }
    this.isLoading = false;
  }

  onPhotoPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onAddPhoto() {
    this.isLoading = true;
    this.addPhoto = false;
    if (this.form.invalid) {
      return;
    }
    this.albumsService.addPhoto(
      this.album.id,
      this.album.title,
      this.album.creator,
      this.album.imagePath,
      this.album.created_date,
      this.form.value.image
    );
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
      this.photosToDisplay = [];
      for (let i = 0; i <= this.album.imagePath.length; i++) {
        if (this.album.imagePath[i]) {
          this.photosToDisplay.push(this.album.imagePath[i]);
        }
      }
      this.totalPhotos = this.photosToDisplay.length;
    });
    this.form.reset();
  }

  onDelete(photo: string) {
    this.isLoading = true;
    const photoToDelete = photo;
    for (let i = this.album.imagePath.length - 1; i >= 0; i--) {
      if (this.album.imagePath[i] === photoToDelete) {
          this.album.imagePath.splice(i, 1);
      }
    }
    this.albumsService.deletePhoto(
      this.albumId,
      this.album.title,
      this.album.creator,
      this.album.imagePath,
      this.album.created_date,
      photoToDelete
    );
    for (let i = 0; i <= this.photosToDisplay.length; i++) {
      if (this.photosToDisplay[i] === photoToDelete) {
        this.photosToDisplay.splice(i, 1);
      }
    }
    // this.albumsService.getAlbum(this.albumId).subscribe(() => {
    //     this.isLoading = false;
    //     this.photosToDisplay = [];
    // });
    this.totalPhotos = this.photosToDisplay.length;
    this.isLoading = false;
  }
}
