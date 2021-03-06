import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleEditComponent } from '@feature/article/edit/article-edit.component';
import { ArticleComponent } from '@page/article/article.component';
import { AuthGuard } from '@guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:albumId',
    component: ArticleEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class ArticlesRoutingModule { }
