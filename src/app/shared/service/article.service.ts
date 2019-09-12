import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment as env } from '@env/environment';
import { Article } from '@interface/article.interface';

const BACKEND_URL = env.apiUrl + '/article/';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Request the article linked to this album.
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
   * Request to create a new article and link it to this album.
   *
   * @param {string} title
   * @param {*} paragraphs
   * @param {string} albumId
   * @param {string} userId
   * @returns {Promise<{message: string, article: Article}>}
   * @memberof ArticleService
   */
  addArticle(title: string, paragraphs: any, albumId: string, userId: string): Promise<{message: string, article: Article}> {
    const articleData = {
      title,
      paragraphs,
      albumId,
      userId
    };
    return this.http.post<{message: string, article: Article}>(BACKEND_URL, articleData).toPromise();
  }

  /**
   * Request to update the article selectionned.
   *
   * @param article
   * @returns {Promise<any>}
   * @memberof ArticleService
   */
  updateArticle(article: Article): Promise<any> {
    return this.http.put(BACKEND_URL + article._id, article).toPromise();
  }

  /**
   * Request to delete the article selectionned.
   *
   * @param {string} articleId
   * @returns {Promise<any>}
   * @memberof ArticleService
   */
  deleteArticle(articleId: string): Promise<any> {
    return this.http.delete(BACKEND_URL + articleId).toPromise();
  }

}
