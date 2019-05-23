import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Article } from './article.model';

const BACKEND_URL = environment.apiUrl + '/article/';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private article: Article[];

  constructor(private http: HttpClient, private router: Router) { }

  getArticleFromAlbumId(albumId: string) {
    const queryParams = `?albumId=${albumId}`;
    return this.http.get<Article>(BACKEND_URL + queryParams);
  }

  addArticle(title: string, paragraphs: any, albumId: string) {
    const articleData = {
      title,
      paragraphs,
      albumId
    };
    this.http.post<{message: string, article: Article}>(BACKEND_URL, articleData)
      .subscribe(() => {
        this.router.navigate(['/albums']);
      });
  }

  deleteArticle(articleId: string) {
    return this.http.delete(BACKEND_URL + articleId);
  }

}
