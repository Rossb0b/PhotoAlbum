import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreateComponent } from '@feature/article/create/article-create.component';
import { ArticleEditComponent } from '@feature/article/edit/article-edit.component';
import { ArticleComponent } from '@page/article/article.component';

const routes: Routes = [
  { path: '', component: ArticleComponent },
  { path: 'create', component: ArticleCreateComponent },
  { path: 'edit/:albumId', component: ArticleEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
