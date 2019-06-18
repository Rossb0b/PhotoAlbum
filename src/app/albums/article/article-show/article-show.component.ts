import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Article } from '../article.interface';
import { ArticleService } from '../article.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-article-show',
  templateUrl: './article-show.component.html',
  styleUrls: ['./article-show.component.css']
})
export class ArticleShowComponent implements OnInit {

  /** current article */
  article: Article;
  /** current ID of the album linked to this article */
  albumId: string;
  /** current ID of logged in user */
  userId: string;
  /** define if front is communicating with API */
  isLoading = false;
  /** define of many paragraphs view as to generate */
  paragraphsLength: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private articleService: ArticleService
    ) {  }

  ngOnInit() {
    this.initialize();
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async initialize(): Promise<void> {
    this.isLoading = true;

    this.handleStorage();

    try {
      await this.articleService.getArticleFromAlbumId(this.albumId).then(result => {
        this.article = result[0];
        this.paragraphsLength = this.article.paragraphs.length;
      });
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.getUserId();

    this.isLoading = false;
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async getUserId(): Promise<void> {
    try {
      this.userId = await this.authService.getUserId();
    } catch (e) {
      /** debugging */
      console.error(e);
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

  /**
   *
   *
   * @param {string} articleId
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async delete(articleId: string): Promise<void> {
    this.isLoading = true;

    try {
      return this.articleService.deleteArticle(articleId).then(() => {
        localStorage.setItem('albumId', this.albumId);
        if (localStorage.getItem('albumId') !== null) {
          this.router.navigate(['/albums/myAlbum']);
        } else {
          this.router.navigate(['/albums']);
        }
      });
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.isLoading = false;
  }

}
