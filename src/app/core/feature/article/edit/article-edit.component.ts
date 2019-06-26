import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PageEvent } from '@angular/material';

import { Album } from '../../../../shared/interface/album.interface';
import { Article } from '../../../../shared/interface/article.interface';
import { ArticleService } from '../../../../shared/service/article.service';
import { AlbumsService } from '../../../../shared/service/albums.service';
import { AuthService } from '../../../../shared/service/auth.service';


@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  /** current album */
  album: Album;
  /** current article */
  article: Article;
  /** ID of current album */
  albumId: string;
  /** ID of current logged in user */
  userId: string;
  /** define if front is communicating with api */
  isLoading = false;
  /** current value of total photo to load */
  totalPhotos = 0;
  /** value of total photo to load wanted */
  photosPerPage = 4;
  /** current page of photo pagination */
  currentPage = 1;
  /** options for number of photo to display */
  pageSizeOptions = [4];
  /** array of current photos to display */
  private photosToDisplay = [];
  /** article form */
  form: FormGroup;
  /** define if form for add a photo pop in view */
  addPhoto = false;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private albumService: AlbumsService,
    private fb: FormBuilder,
  ) {
      // this.form = this.fb.group({
      //   title: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(34)]],
      //   paragraphs: this.fb.array([])
      // });

      // const p = this.form.controls.paragraphs as FormArray;
      // p.push(this.fb.group({
      //   content: [null, Validators.required],
      //   path: [null],
      //   alt: [null],
      // }));
   }

  ngOnInit() {
    this.initialize();
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleEditComponent
   */
  async initialize(): Promise<void> {
    this.isLoading = true;
    this.albumId = this.route.snapshot.params.albumId;

    this.getAlbum();

    try {
      this.article = await this.articleService.getArticleFromAlbumId(this.albumId);
    } catch (e) {
      /** Debugging */
      console.error(e);
    }


    this.buildForm();

    this.isLoading = false;
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleEditComponent
   */
  async getAlbum(): Promise<void> {
    try {
      const result = await this.albumService.getAlbum(this.albumId);
      this.album = result.album;
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.totalPhotos = this.album.images.length;
    for (let i = 0; i < this.photosPerPage; i++) {
      if (this.album.images[i]) {
        this.photosToDisplay.push(this.album.images[i]);
      }
    }
  }

  /**
   *
   *
   * @memberof ArticleEditComponent
   */
  buildForm(): void {
    this.form = this.fb.group({
      title: [this.article[0].title, [Validators.required, Validators.minLength(4), Validators.maxLength(34)]],
      paragraphs: this.fb.array([])
    });

    this.article[0].paragraphs.forEach(paragraph => {
      const p = this.form.controls.paragraphs as FormArray;
      p.push(this.fb.group({
        content: [paragraph.content, Validators.required],
        path: [paragraph.path],
        alt: [paragraph.alt],
      }));
    });
  }

  /**
   *
   *
   * @param {PageEvent} pageData
   * @memberof ArticleEditComponent
   */
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.addPhoto = false;
    this.currentPage = pageData.pageIndex + 1;
    this.photosPerPage = pageData.pageSize;
    this.photosToDisplay = [];
    const newIndex = this.photosPerPage * pageData.pageIndex;
    for (let i = newIndex; i <= newIndex + this.photosPerPage - 1; i++) {
      if (this.album.images[i]) {
        this.photosToDisplay.push(this.album.images[i]);
      }
    }
    this.isLoading = false;
  }

  /**
   *
   *
   * @memberof ArticleEditComponent
   */
  goToView(): void {
    const element = document.getElementById('submit-button');
    const y = element.getBoundingClientRect().top + window.scrollY;
    window.scroll({
      top: y,
      behavior: 'smooth'
    });
  }

  /**
   *
   *
   * @memberof ArticleEditComponent
   */
  addparagraph(): void {
    console.log('1', this.form.get('paragraphs'));
    const p = this.form.controls.paragraphs as FormArray;
    p.push(this.fb.group({
      content: [null, Validators.required],
      path: [null],
      alt: [null],
    }));
    this.goToView();
  }

  /**
   * @memberof ArticleEditComponent
   */
  deleteparagraph(): void {
    const p = this.form.controls.paragraphs as FormArray;
    const length = p.length;
    if (length > 1) {
      p.removeAt(length - 1);
    }
    this.goToView();
  }

  /**
   *
   *
   * @param {number} index
   * @memberof ArticleEditComponent
   */
  displayChooseImg(index: number): void {
    const div = document.getElementsByClassName('choose-image') as any;
    for (let i = 0; i < div.length; i++) {
      if (i === index) {
        div[i].style.display = 'block';
      } else {
        div[i].style.display = 'none';
      }
    }
    this.goToView();
  }

  /**
   *
   *
   * @param {number} index
   * @param {{path: string, alt: string}} photo
   * @memberof ArticleEditComponent
   */
  selectImage(index: number, photo: {path: string, alt: string}): void {
    const p = this.form.controls.paragraphs as FormArray;
    p.controls[index].get('path').setValue(photo.path);
    p.controls[index].get('alt').setValue(photo.alt);
    this.goToView();
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleEditComponent
   */
  async saveArticle(): Promise<void> {
    this.isLoading = true;

    if (this.form.valid) {

      this.article[0].title = this.form.value.title;
      this.article[0].paragraphs = this.form.value.paragraphs;

      try {
        await this.articleService.updateArticle(this.article[0]);
      } catch (e) {
        /** debugging */
        console.error(e);
      }

      this.router.navigate(['/albums']);

    }

    this.isLoading = false;
  }
}
