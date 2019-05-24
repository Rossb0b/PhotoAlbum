import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
import { ArticleShowComponent } from './albums/article/article-show/article-show.component';
import { ArticleCreateComponent } from './albums/article/article-create/article-create.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'createPost', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'editPost/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'profile/:userId', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'albums/myAlbum/Article', component: ArticleShowComponent, canActivate: [AuthGuard] },
  { path: 'albums/myAlbum/newArticle', component: ArticleCreateComponent, canActivate: [AuthGuard] },
  { path: 'albums', loadChildren: './albums/albums.module#AlbumsModule', canActivate: [AuthGuard] }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
