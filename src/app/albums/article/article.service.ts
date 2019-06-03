import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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

  getArticleFromAlbumId(albumId: string): Observable<Article> {
    const queryParams = `?albumId=${albumId}`;
    return this.http.get<Article>(BACKEND_URL + queryParams);
  }

  addArticle(title: string, paragraphs: any, albumId: string, owner: string) {
    const articleData = {
      title,
      paragraphs,
      albumId,
      owner
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
