import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from '../article.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';


@Component({
  selector: 'app-article-show',
  templateUrl: './article-show.component.html',
  styleUrls: ['./article-show.component.css']
})
export class ArticleShowComponent implements OnInit {

  isLoading = false;
  articleExist = false;
  albumId: string;
  article: Article;
  userId: string;
  paragraphsLength: number;
  public userIsAuthenticated: boolean;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private articleService: ArticleService) {  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.userId = this.authService.getUserId();
    this.albumId = localStorage.getItem('albumId');
    localStorage.removeItem('albumId');
    if (this.albumId !== null) {
      this.articleService.getArticleFromAlbumId(this.albumId).subscribe(articleData => {
        if (Object.entries(articleData).length > 0) {
          this.isLoading = false;
          this.article = {
            id: articleData[0]._id,
            title: articleData[0].title,
            paragraphs: articleData[0].paragraphs,
            creator: articleData[0].creator,
            albumId: articleData[0].albumId,
            created_date: articleData[0].created_date,
          };
          this.articleExist = true;
          this.paragraphsLength = this.article.paragraphs.length;
        }
      });
    } else {
      this.router.navigate(['/albums']);
    }
  }

  onDelete(articleId: string) {
    this.isLoading = true;
    this.articleService.deleteArticle(articleId).subscribe(() => {
      this.router.navigate(['/albums']);
    });
  }

}
