# ImageAlbum

## Technical spec

* Angular CLI 7.3.7
* Angular 7.2.11
* NodeJS 11.8
* npm 6.5
* Nodemon 1.19

## Development server

To run the project : 
  * Run `ng serve` for run the front. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
  * Run `npm run start:server` for run the back. The API is host on port 3030, so at `http://localhost:3030/`. The app will automatically reload if you change any of the source files aswell.

## Code scaffolding for Angular

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Exploring the application

### The first step is to use a user already existing or to create your own to connect to the app.

Pre-existing user list that you can use :
  * Email : test@test.fr / Password : test
  * Email : test2@test.fr / Password : test

### Then you have multiple possibilities :  

=> Access to your Profile through the header : 
	* There you can change your avatar, this one is being saved in local at ./backend/images/avatar.

=> Access to the albums through the header : 
	* ! If this is a new user :
              * Create a new album by going on "New Album". The images selectionned are registred in local at ./backend/images/photos.
	* Edit Album allow you to modifie the album's title, and to add or delete a user to the shared list of user for this album.
	* You can access to each album by clicking on "Show" underneath each of those one.

=> When on an album :
  * Possibility to add a picture one by one directly to the album.
	* Possibility to delete a photo (PS : this last one will be deleted in local aswell).
        * ! If there is not any article existing for this album :
              * Create a new one through "Create Article" (Use "TAB" touch to navigate to differents paragraphs if you choose to create multiple).
	* ! If there is an article existing for this album :
	      - You can access to this last one by clicking on "Show Article".

=> When on an article :
	* You can add a comment to the article and manage them.
	* Edit the article.
	* Delete it.
