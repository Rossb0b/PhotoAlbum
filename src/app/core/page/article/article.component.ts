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

  /** current status of editing comment */
  editingComment = false;
  /** current list of all user */
  users: User[] = [];
  /** current article */
  article: Article;
  /** current ID of the album linked to this article */
  albumId: string;
  /** current ID of logged in user */
  userId: string;
  /** current list of all user with filtered data */
  filteredUsers: {_id: string, firstname: string, lastname: string}[] = [];
  /** current list of comments */
  comments: Comment[] = [];
  /** define if front is communicating with API */
  isLoading = false;
  /** comment create form */
  form: FormGroup;
  /** comment edit form */
  editCommentForm: FormGroup;
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
   * Initialize the component;
   * Set the loading on true,
   * Identify the albumId from the url,
   * Define the artile to show in function of the albumId,
   * Get the userId of current logged in user,
   * Get list of all users,
   * Get list of comments to show,
   * Set the loading on false,
   *
   * @returns {Promise<void>}
   * @memberof ArticleShowComponent
   */
  async initialize(): Promise<void> {
    this.isLoading = true;
    this.albumId = this.route.snapshot.params.albumId;

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
   * Set the form to add new comment to the article,
   * Set the form to edit a listed comment of the article,
   *
   * @memberof ArticleShowComponent
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      content: new FormControl(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(80)] }),
    });

    this.editCommentForm = this.formBuilder.group({
      content: new FormControl(null, { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(80)] })
    });
  }

  /**
   * Function called to editing a comment.
   * First check if the user isn't already editing a comment,
   * If the user isn't already editing a comment, tell the app that he is doing it now,
   * Hide the comment actually being edit,
   * Set the value of this comment to the editCommentForm,
   * Show the edit form for this comment.
   * If the user is already editing a comment, display an error message inviting him to close the first edit block,
   *
   * @param index
   */
  editComment(index: number) {
    if (this.editingComment === false) {
      this.editingComment = true;
      (document.querySelector('.commentary-container-' + index) as HTMLElement).style.display = 'none';
      this.editCommentForm.patchValue(this.comments[index]);
      (document.querySelector('.edit-commentary-container-' + index) as HTMLElement).style.display = 'block';
    } else {
      alert('Close the first form');
    }
  }

  /**
   * Function called to close an editing form.
   * First, tell the app that the user isn't editing a comment anymore by swithching value of editingComment to false,
   * Hide the edit form actually being showed,
   * Then show the comment that was being edit,
   *
   * @param {number} index
   * @memberof ArticleComponent
   */
  cancelEditComment(index: number) {
    this.editingComment = false;
    (document.querySelector('.commentary-container-' + index) as HTMLElement).style.display = 'block';
    (document.querySelector('.edit-commentary-container-' + index) as HTMLElement).style.display = 'none';
  }

  /**
   * Get the userId of the current logged in user.
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
   * Get every users,
   * redefine the users for fetch only wanted data.
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
   * Get every comments linked to this article.
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
   * Function called to creating a new comment.
   * Set the loading on true,
   * Save the new comment on database,
   * Refresh the list of comments,
   * Reset the form to add comments,
   * Set the loading on false,
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
   * Function called to save the edit of a comment.
   * Set the loading on true,
   * If the editComment form is validate, get the value of the form,
   * Save the new comment on database,
   * Tell the app that the user isn't editing a comment anymore,
   * Set the loading on false,
   *
   * @param {number} index
   * @returns {Promise<void>}
   * @memberof ArticleComponent
   */
  async saveComment(index: number): Promise<void> {
    this.isLoading = true;

    if (this.editCommentForm.valid) {
      const editedComment = this.comments[index];
      editedComment.content = this.editCommentForm.get('content').value;

      try {
        await this.commentService.updateComment(editedComment);
      } catch (e) {
        /** debugging */
        console.error(e);
        alert('server couldn\'t update comment, try again later');
      }
    }

    this.editingComment = false;
    this.isLoading = false;
  }

  /**
   * Function called to delete a comment.
   * Set the loading on true,
   * Delete the comment selectionned,
   * Refresh list of comments,
   * Set the loading on false,
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
   * Function called to delete the article.
   * Set loading on true,
   * Delete the actual article,
   * Redirect to the album that was link to the article deleted,
   * Set loading on false (in case of error),
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
