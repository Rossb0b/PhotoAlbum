import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { Comment } from '@interface/comment.interface';
import { environment as env } from '@env/environment';

const BACKEND_URL = env.apiUrl + '/comments/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient, private router: Router) { }

    /**
     * Request to get the comments of this article.
     *
     * @param articleId
     * @returns {Promise<any>}
     * @memberof CommentService
     */
    getCommentsFromArticleId(articleId: string): Promise<any> {
        const queryParams = `?articleId=${articleId}`;
        return this.http.get(BACKEND_URL + queryParams).toPromise();
    }

    /**
     * Request to create a new comment for this article.
     *
     * @param content
     * @param userId
     * @param articleId
     * @returns {Promise<any>}
     * @memberof CommentService
     */
    addComment(content: string, userId: string, articleId: string): Promise<any> {
        const commentData = {
            content,
            userId,
            articleId,
        };

        return this.http.post<{message: string, comment: Comment}>(BACKEND_URL, commentData).toPromise();
    }

    /**
     * Request to edit the comment selectionned.
     *
     * @param comment
     * @returns {Promise<any>}
     * @memberof CommentService
     */
    updateComment(comment: Comment): Promise<any> {
      return this.http.put(BACKEND_URL + comment._id, comment).toPromise();
    }

    /**
     * Request to delete the comment selectionned.
     *
     * @param commentId
     * @returns {Promise<any>}
     * @memberof CommentService
     */
    deleteComment(commentId: string): Promise<any> {
        return this.http.delete(BACKEND_URL + commentId).toPromise();
    }
}
