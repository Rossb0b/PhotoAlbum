import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';


import { Album } from '../album.interface';
import { Article } from '../article/article.interface';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../../auth/auth.service';
import { ArticleService } from '../article/article.service';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';

@Component({
  selector: 'app-album-show',
  templateUrl: './album-show.component.html',
  styleUrls: ['./album-show.component.css']
})
export class AlbumShowComponent implements OnInit {

  /** current album */
  album: Album;
  /** ID of the current album */
  albumId: string;
  /** current article if exist */
  article: Article;
  /** ID of the current article if exist */
  articleId: string;
  /** current status of article */
  articleExist = false;
  /** define if front is communicating with api */
  isLoading = false;
  /** current ID of logged in user */
  userId: string;
  /** current array of images to display */
  newArrayOfImage: any;
  /** current value of total photo to load */
  totalPhotos = 0;
  /** value of total photo to load wanted */
  photosPerPage = 4;
  /** current page of photo pagination */
  currentPage = 1;
  /** options for number of photo to display */
  pageSizeOptions = [1, 2, 4];
  /** current array of photo to display */
  photosToDisplay: {path: string, alt: string}[] = [];
  /** album form */
  form: FormGroup;
  /** image to add previewsly selected */
  imagePreview: any;
  /** define if form to add photo must appear */
  addPhoto = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private albumService: AlbumsService,
    private articleService: ArticleService,
    private router: Router
    ) {
      this.buildForm();
    }

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
      }

      this.handleStorage();
      this.getAlbum();
      this.getArticle();

      console.log(this.albumId);

      this.isLoading = false;
    }

    async getAlbum(): Promise<void> {
      try {
        this.album = await this.albumService.getAlbum(this.albumId);
      } catch (e) {
        /** debugging */
        console.error(e);
      }

      this.totalPhotos = this.album.images.length;
      for (let i = 0; i <= this.photosPerPage - 1; i++) {
        if (this.album.images[i]) {
          const image = {path: this.album.images[i].path, alt: this.album.images[i].alt};
          this.photosToDisplay.push(image);
        }
      }
    }

    async getArticle(): Promise<void> {
      try {
        this.article = await this.articleService.getArticleFromAlbumId(this.albumId);
      } catch (e) {
        /** debugging */
        console.error(e);
      }

      if (this.article) {
        this.articleExist = true;
        this.articleId = this.article.id;
      }
    }

    /**
     * definie albumId saved in localstorage
     * clean localstorage form 'albumId'
     * @returns void
     */
    handleStorage(): void {
      this.albumId = localStorage.getItem('albumId');
      localStorage.removeItem('albumId');

      if (this.albumId === null) {
        this.router.navigate(['/albums']);
      }
    }

    buildForm(): void {
      this.form = this.formBuilder.group({
        image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
      });
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
        if (this.album.images[i]) {
          this.photosToDisplay.push({path: this.album.images[i].path, alt: this.album.images[i].alt});
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
      // this.albumsService.addPhoto(
      //   this.album.id,
      //   this.album.title,
      //   this.album.creator,
      //   this.album.imagePath,
      //   this.album.created_date,
      //   this.form.value.image
      // );
      // this.albumsService.getAlbum(this.albumId).subscribe(albumData => {
      //   this.isLoading = false;
      //   this.album = {
      //     id: albumData._id,
      //     title: albumData.title,
      //     imagePath: albumData.imagesPath,
      //     linked_friendsId: albumData.linked_friendsId,
      //     creator: albumData.creator,
      //     created_date: albumData.created_date,
      //   };
      //   this.photosToDisplay = [];
      //   for (let i = 0; i <= this.album.imagePath.length; i++) {
      //     if (this.album.imagePath[i]) {
      //       this.photosToDisplay.push(this.album.imagePath[i]);
      //     }
      //   }
      //   this.totalPhotos = this.photosToDisplay.length;
      // });
      this.form.reset();
      this.isLoading = false;
    }

    onDelete(photo: string) {
      this.isLoading = true;
      const photoToDelete = photo;
      // for (let i = this.album.imagePath.length - 1; i >= 0; i--) {
      //   if (this.album.imagePath[i] === photoToDelete) {
      //       this.album.imagePath.splice(i, 1);
      //   }
      // }
      // this.albumsService.deletePhoto(
      //   this.albumId,
      //   this.album.title,
      //   this.album.creator,
      //   this.album.imagePath,
      //   this.album.created_date,
      //   photoToDelete
      // );
      // for (let i = 0; i <= this.photosToDisplay.length; i++) {
      //   if (this.photosToDisplay[i] === photoToDelete) {
      //     this.photosToDisplay.splice(i, 1);
      //   }
      // }
      // this.albumsService.getAlbum(this.albumId).subscribe(() => {
      //     this.isLoading = false;
      //     this.photosToDisplay = [];
      // });
      this.totalPhotos = this.photosToDisplay.length;
      this.isLoading = false;
    }

  }
