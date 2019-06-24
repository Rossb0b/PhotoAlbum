import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleShowComponent } from './article-show/article-show.component';

const routes: Routes = [
  { path: '', component: ArticleShowComponent },
  { path: 'create', component: ArticleCreateComponent },
  { path: 'edit/:albumId', component: ArticleEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
