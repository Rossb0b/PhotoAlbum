import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './core/nagivation/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './core/shared/helper/error-interceptor';
import { ErrorComponent } from './core/shared/component/error/error.component';
import { AngularMaterialModule } from './core/shared/angular-material.module';
import { UsersModule } from './users/users.module';
import { AlbumsService } from './core/shared/service/albums.service';
import { HomeComponent } from './home/home.component';
import { ArticlesModule } from './core/page/albums/article/articles.module';
import { AlbumComponent } from './core/page/album/album.component';
import { ArticleComponent } from './core/page/article/article.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    HomeComponent,
    AlbumComponent,
    ArticleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    UsersModule,
    ArticlesModule,
  ],
  providers: [
    AlbumsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
