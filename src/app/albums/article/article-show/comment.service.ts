import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { Comment } from './comment.interface';
import { environment as env } from '../../../../environments/environment';

const BACKEND_URL = env.apiUrl + '/comments/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

    /** current list of album fetched */
    private comments: Comment[] = [];

    constructor(private http: HttpClient, private router: Router) { }

    getCommentsFromArticleId(articleId: string): Promise<any> {
        const queryParams = `?articleId=${articleId}`;
        return this.http.get(BACKEND_URL + queryParams).toPromise();
    }

    addComment(content: string, creator: string, articleId, string): Promise<any> {
        const commentData = {
            content,
            creator,
            articleId,
        };
        return this.http.post<{message: string, comment: Comment}>(BACKEND_URL, commentData).toPromise();
    }

    deleteComment(commentId: string): Promise<any> {
        return this.http.delete(BACKEND_URL + commentId).toPromise();
    }
}
