import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleShowComponent } from './article-show/article-show.component';
import { ArticleCreateComponent } from './article-create/article-create.component';




@NgModule({
  declarations: [
    ArticleShowComponent,
    ArticleCreateComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class ArticleModule {}
