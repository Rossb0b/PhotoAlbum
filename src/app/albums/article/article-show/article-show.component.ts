import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Article } from '../article.interface';
import { ArticleService } from '../article.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from './comment.interface';
import { CommentService } from './comment.service';
import { User } from 'src/app/users/user.interface';
import { UserService } from 'src/app/users/user.service';


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
  /** current list of all user */
  users: User[] = [];
  /** current list of all user with filtered data */
  filteredUsers: {_id: string, firstname: string, lastname: string}[] = [];
  /** current list of comments */
  comments: Comment[] = [];
  /** define if front is communicating with API */
  isLoading = false;
  /** comment form */
  form: FormGroup;
  /** define of many paragraphs view as to generate */
  paragraphsLength: number;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private articleService: ArticleService,
    private commentService: CommentService,
    private userService: UserService,
    ) {
      this.buildForm();
     }

  ngOnInit() {
    this.initialize();
  }

  /**
   *
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async initialize(): Promise<void> {
    this.isLoading = true;

    this.handleStorage();

    try {
      const result = await this.articleService.getArticleFromAlbumId(this.albumId);
      this.article = result[0];
      this.paragraphsLength = this.article.paragraphs.length;
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.getUserId();
    this.getUsers();
    this.getComments();

    this.isLoading = false;
  }

  /**
   *
   * definie albumId saved in localstorage
   * clean localstorage form 'albumId'
   *
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
   * @memberof ArticleShowComponent
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      content: new FormControl(null, {validators: [Validators.required, Validators.minLength(1), Validators.maxLength(80)]}),
    });
  }

  /**
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
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async getUsers(): Promise<void> {
    try {
      this.users = await this.userService.getUsers();

      this.users.forEach(fetchedUser => {
        const filteredUser = {
          _id: fetchedUser._id,
          firstname: fetchedUser.firstname,
          lastname: fetchedUser.lastname,
          imagePath: fetchedUser.imagePath,
        };
        this.filteredUsers.push(filteredUser);
      });
    } catch (e) {
      /** debugging */
      console.error(e);
    }
  }

  /**
   *
   *
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async getComments(): Promise<void> {
    try {
      const result = await this.commentService.getCommentsFromArticleId(this.article._id);
      this.comments = result.comments;
      console.log(this.comments);
    } catch (e) {
      /** debugging */
      console.error(e);
    }
  }

  /**
   *
   *
   * @memberof ArticleShowComponent
   */
  async createComment(): Promise<void> {
    this.isLoading = true;

    if (this.form.valid) {
      try {
        await this.commentService.addComment(
          this.form.value.content,
          this.userId,
          this.article._id,
        ).then(() => {
          this.getComments();
        });
      } catch (e) {
        /** debugging */
        console.error(e);
      }
    }

    this.isLoading = false;
  }

  /**
   *
   * @param commentId
   */
  async deleteComment(commentId: string): Promise<void> {
    this.isLoading = true;

    try {
      await this.commentService.deleteComment(commentId).then(() => {
        this.getComments();
      });
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.isLoading = false;
  }

  /**
   *
   *
   * @param {string} articleId
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async deleteArticle(articleId: string): Promise<void> {
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
