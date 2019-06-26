import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ArticleCreateComponent } from '@feature/article/create/article-create.component';
import { ArticleEditComponent } from '@feature/article/edit/article-edit.component';
import { AngularMaterialModule } from '@shared/angular-material.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleComponent } from './article.component';




@NgModule({
  declarations: [
    ArticleComponent,
    ArticleCreateComponent,
    ArticleEditComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ArticlesRoutingModule,
    RouterModule,
  ]
})
export class ArticlesModule {}
