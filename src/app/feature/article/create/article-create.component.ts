import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PageEvent } from '@angular/material';

import { Album } from '@interface/album.interface';
import { ArticleService } from '@service/article.service';
import { AlbumsService } from '@service/albums.service';


@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {

  /** current album */
  album: Album;
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
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private albumService: AlbumsService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: [null, { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(34)] }],
      paragraphs: this.fb.array([])
    });

    const p = this.form.controls.paragraphs as FormArray;
    p.push(this.fb.group({
      content: [null, { validators: [Validators.required, Validators.minLength(80), Validators.maxLength(525)] }],
      path: [null],
      alt: [null],
    }));
  }

  ngOnInit() {
    this.initialize();
  }

  /**
   * Initialize the component.
   * Set loading on true,
   * Identify the albumId from the url,
   * Get the album linked to the article we want to create,
   * Set loading on false,
   *
   * @returns {Promise<void>}
   * @memberof ArticleCreateComponent
   */
  async initialize(): Promise<void> {
    this.isLoading = true;
    this.albumId = this.route.snapshot.params.albumId;

    this.getAlbum();

    this.isLoading = false;
  }

  /**
   * Get the album we use to create the article.
   * Push the images to an array for the pagination system.
   *
   * @returns {Promise<void>}
   * @memberof ArticleCreateComponent
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
   * Display images in fonction of pageData information.
   *
   * @param {PageEvent} pageData
   * @memberof ArticleCreateComponent
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
   * @memberof ArticleCreateComponent
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
   * @memberof ArticleCreateComponent
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
   * @memberof ArticleCreateComponent
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
   * @memberof ArticleCreateComponent
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
   * @memberof ArticleCreateComponent
   */
  selectImage(index: number, photo: {path: string, alt: string}): void {
    const p = this.form.controls.paragraphs as FormArray;
    p.controls[index].get('path').setValue(photo.path);
    p.controls[index].get('alt').setValue(photo.alt);
    this.goToView();
  }

  /**
   * Function called to create the article.
   * Set loading on true,
   * If creation is a success, redirect to the article created,
   * Set loading on false in case of error,
   *
   * @returns {Promise<void>}
   * @memberof ArticleCreateComponent
   */
  async saveArticle(): Promise<void> {
    this.isLoading = true;

    try {
      let paragraphs = [];

      for (let i = 0; i <= this.form.value.paragraphs.length - 1; i++) {
        let paragraph: {
          content: string,
          image: {
            path: string,
            alt: string
          }} = {
            content: this.form.value.paragraphs[i].content,
            image: {
              path: this.form.value.paragraphs[i].path,
              alt: this.form.value.paragraphs[i].alt
            }};
        paragraphs.push(paragraph);
      }

      await this.articleService.addArticle(
        this.form.value.title,
        paragraphs,
        this.album._id,
        this.album.userId,
      );

      this.router.navigate(['/albums/article', this.albumId]);
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.isLoading = false;
  }
}
