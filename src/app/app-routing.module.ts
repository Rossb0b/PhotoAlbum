import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'profile/:userId', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'albums', loadChildren: './albums/albums.module#AlbumsModule', canActivate: [AuthGuard] },
  { path: 'albums/myAlbum/Article', loadChildren: './albums/article/articles.module#ArticlesModule', canActivate: [AuthGuard] },
  { path: 'posts', component: PostListComponent },
  { path: 'createPost', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'editPost/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
