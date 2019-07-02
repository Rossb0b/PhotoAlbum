import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Article } from '@interface/article.interface';
import { User } from '@interface/user.interface';
import { Comment } from '@interface/comment.interface';
import { ArticleService } from '@service/article.service';
import { AuthService } from '@service/auth.service';
import { CommentService } from '@service/comment.service';
import { UserService } from '@service/user.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

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
    private route: ActivatedRoute,
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
    this.albumId = this.route.snapshot.params.albumId;

    // this.handleStorage();

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

    this.form.reset();
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
        this.router.navigate(['albums', this.albumId]);
      });
    } catch (e) {
      /** debugging */
      console.error(e);
    }

    this.isLoading = false;
  }

}
