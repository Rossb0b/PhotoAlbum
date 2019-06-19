import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Article } from './article.interface';

const BACKEND_URL = environment.apiUrl + '/article/';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private article: Article[];

  constructor(private http: HttpClient, private router: Router) { }

  /**
   *
   *
   * @param {string} albumId
   * @returns {Promise<Article>}
   * @memberof ArticleService
   */
  getArticleFromAlbumId(albumId: string): Promise<Article> {
    const queryParams = `?albumId=${albumId}`;
    return this.http.get<Article>(BACKEND_URL + queryParams).toPromise();
  }

  /**
   *
   *
   * @param {string} title
   * @param {*} paragraphs
   * @param {string} albumId
   * @param {string} owner
   * @returns {Promise<{message: string, article: Article}>}
   * @memberof ArticleService
   */
  addArticle(title: string, paragraphs: any, albumId: string, owner: string): Promise<{message: string, article: Article}> {
    const articleData = {
      title,
      paragraphs,
      albumId,
      owner
    };
    return this.http.post<{message: string, article: Article}>(BACKEND_URL, articleData).toPromise();
  }

  /**
   *
   *
   * @param {string} articleId
   * @returns {Promise<any>}
   * @memberof ArticleService
   */
  deleteArticle(articleId: string): Promise<any> {
    return this.http.delete(BACKEND_URL + articleId).toPromise();
  }

}
