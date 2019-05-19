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
    return this.http.get<Article>(BACKEND_URL + albumId);
  }

  addArticle(title: string, paragraphs: any, albumId: string) {
    const articleData = new FormData();
    articleData.append('title', title);
    // paragraphs.map((paragraph: {content: string, path: string, alt: string}) =>
    //   articleData.append('paragraphs[]', paragraphs)
    // );
    // paragraphs.forEach(paragraph => {
    //   // console.log(paragraph.content);
    //   // console.log(paragraph.path);
    //   // console.log(paragraph.alt);
    //   console.log(paragraph);
    //   articleData.append('paragraphs[]', paragraph);
    // });
    articleData.append('albumId', albumId);
    // console.log(articleData.getAll('title'));
    // console.log(articleData.getAll('albumId'));
    // console.log(articleData.getAll('paragraphs[]'));
    this.http.post<{message: string, article: Article}>(BACKEND_URL, articleData)
    .subscribe(() => {
      // return this.http.post(Body)
      this.router.navigate(['/albums']);
    });
    // return this.http.post(Body);
  }

}
