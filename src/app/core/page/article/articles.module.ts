import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ArticleShowComponent } from './article-show/article-show.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { AngularMaterialModule } from '../../../shared/angular-material.module';
import { ArticlesRoutingModule } from './articles-routing.module';




@NgModule({
  declarations: [
    ArticleShowComponent,
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
