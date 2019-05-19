import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Album } from '../../album.model';
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
  albumId: string;
  album: Album;
  userId: string;
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
      // Handle shits
    } else {
      this.router.navigate(['/albums']);
    }
  }
}
