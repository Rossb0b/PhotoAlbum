import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ArticleService } from '../article.service';
import { Article } from '../article.model';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Album } from '../../album.model';
import { AlbumsService } from '../../albums.service';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {

  isLoading = false;
  private mode = 'create';
  results = [];
  userId: string;
  albumId: string;
  album: Album;
  totalPhotos = 0;
  photosPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [4];
  photosToDisplay = [];
  selectedPhoto: string;

  article: Article;
  form: FormGroup;
  public userIsAuthenticated: boolean;
  private authStatusSub: Subscription;

  imagePreview: string;
  addPhoto = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private articleService: ArticleService,
    private albumsService: AlbumsService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(18)]],
      paragraphs: this.fb.array([])
    });

    const p = this.form.controls.paragraphs as FormArray;
    p.push(this.fb.group({
      content: [null, Validators.required],
      path: [null],
      alt: [null],
    }));
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.userId = this.authService.getUserId();
    this.albumId = localStorage.getItem('albumId');
    localStorage.removeItem('albumId');
    if (this.albumId !== null) {
      this.albumsService.getAlbum(this.albumId).subscribe(albumData => {
        this.isLoading = false;
        this.album = {
          id: albumData._id,
          title: albumData.title,
          imagePath: albumData.imagesPath,
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

  addparagraph(): void {
    console.log('1', this.form.get('paragraphs'));
    const p = this.form.controls.paragraphs as FormArray;
    p.push(this.fb.group({
      content: [null, Validators.required],
      path: [null],
      alt: [null],
    }));
  }

  displayChooseImg(index: number): void {
    const div = document.getElementsByClassName('choose-image') as any;
    for (let i = 0; i < div.length; i++) {
      if (i === index) {
        div[i].style.display = 'block';
      } else {
        div[i].style.display = 'none';
      }
    }
  }

  selectImage(index: number, photo: string): void {
    // console.log(this.form.controls.paragraphs);
    const p = this.form.controls.paragraphs as FormArray;
    // p.controls[index].setValue
    console.log(p.controls[index]);
    p.controls[index].get('path').setValue(photo);
    p.controls[index].get('alt').setValue('image');
    console.log(p);
    console.log(photo);
  }

  onSaveArticle() {
    // if (this.form.invalid) {
    //     return;
    // }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log(this.form.value);
      this.isLoading = false;
      console.log(this.form.value.paragraphs);
      this.articleService.addArticle(
        this.form.value.title,
        this.form.value.paragraphs,
        this.album.id
        );
    } else {
      console.log('edit');
      // this.albumsService.updateAlbum({
      //   id: this.albumId,
      //   title: this.form.value.title,
      //   creator: this.album.creator,
      //   imagePath: this.album.imagePath,
      //   created_date: this.album.created_date
      // });
    }
    this.form.reset();
  }
}
