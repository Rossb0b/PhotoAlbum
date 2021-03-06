import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PageEvent } from '@angular/material';

import { Album } from '@interface/album.interface';
import { Article } from '@interface/article.interface';
import { ArticleService } from '@service/article.service';
import { AlbumsService } from '@service/albums.service';
import { AuthService } from '@service/auth.service';

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
  photosToDisplay = [];
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
  ) { }

  ngOnInit() {
    this.initialize();
  }

  /**
   * Initialize the component.
   * Set loading on true,
   * Identify the albumId from the url,
   * Get the album linked to the article,
   * Get the article from the albumId,
   * Init the form to edit the article,
   * Set loading on false,
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
   * Get the album linked to the article for edit this last one.
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
   * Build the form to edit the article.
   *
   * @memberof ArticleEditComponent
   */
  buildForm(): void {
    this.form = this.fb.group({
      title: [this.article[0].title, { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(34)] }],
      paragraphs: this.fb.array([])
    });

    this.article[0].paragraphs.forEach(paragraph => {
      const p = this.form.controls.paragraphs as FormArray;
      p.push(this.fb.group({
        content: [paragraph.content, { validators: [Validators.required, Validators.minLength(80), Validators.maxLength(525)] }],
        path: [paragraph.image.path],
        alt: [paragraph.image.alt],
      }));
    });
  }

  /**
   * Display images in fonction of pageData information.
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
   * Scrolling method called on paragraphs select and on creation of a new paragraph.
   * It scrolls to the bottom of the page (submit button) for a better UX.
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
   * Push a new paragraph to the form.
   *
   * @memberof ArticleEditComponent
   */
  addparagraph(): void {
    console.log('1', this.form.get('paragraphs'));
    const p = this.form.controls.paragraphs as FormArray;
    p.push(this.fb.group({
      content: [null, { validators: [Validators.required, Validators.minLength(80), Validators.maxLength(525)] }],
      path: [null],
      alt: [null],
    }));
    this.goToView();
  }

  /**
   * Delete the last paragraph of the form.
   *
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
   * When user select a paragraph, display the list of photos he can choose to illustrate this paragraph.
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
   * For each image that user selected to create a paragraph, display it underneath.
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
   * Function called to edit the article.
   * Set loading on true,
   * If edition is a success, redirect to the article edited,
   * Set loading on false in case of error,
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

      this.router.navigate(['/albums/article', this.albumId]);
    }

    this.isLoading = false;
  }
}
