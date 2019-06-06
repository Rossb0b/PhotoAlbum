import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AlbumShowComponent implements OnInit, OnDestroy {

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
      // localStorage.removeItem('albumId');

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
      if (localStorage.getItem('albumId') === null) {
        this.router.navigate(['/albums/myAlbum/Article']);
      } else {
        this.router.navigate(['/albums/myAlbum']);
      }
    }

    onAddArticle(albumId: string) {
      localStorage.setItem('albumId', albumId);
      if (localStorage.getItem('albumId') === null) {
        this.router.navigate(['/albums/myAlbum/newArticle']);
      } else {
        this.router.navigate(['/albums/myAlbum']);
      }
    }

    /**
     *
     * @param pageData data from pagination
     * display images in fonction of pageData information
     * @returns void
     */
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

    /**
     *
     * @param event on pick image
     * handle the image preview on image select
     * @returns void
     */
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

    async AddPhoto(): Promise<void> {
      this.isLoading = true;
      this.addPhoto = false;

      if (this.form.invalid) {
        return;
      }

      try {
        await this.albumService.addPhoto(this.album, this.form.value.image);
      } catch (e) {
        /** debugging */
        console.error(e);
        alert('Adding a photo to the album failed');
      }

      this.getAlbum();
      this.form.reset();
      this.isLoading = false;
    }

    async deletePhoto(photo: string): Promise<void> {
      this.isLoading = true;

      for (let i = 0; i < this.album.images.length; i++) {
        if (this.album.images[i].path === photo) {
            this.album.images.splice(i, 1);
        }
      }

      try {
        await this.albumService.deletePhoto(this.album, photo);
      } catch (e) {
        /** debugging */
        console.error(e);
      }

      this.getAlbum();
      this.isLoading = false;
    }

    ngOnDestroy(): void {
      localStorage.removeItem('albumId');
    }
  }
