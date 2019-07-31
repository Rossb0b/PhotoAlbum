import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Album } from '@interface/album.interface';
import { AlbumsService } from '@service/albums.service';
import { mimeType } from '@helper/validator/mime-type.validator';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrls: ['./album-create.component.css']
})
export class AlbumCreateComponent {

  /** current album to save */
  album: Album;
  /** array of images to add previewsly selected */
  imagePreview = [];
  /** define if front is communicating with api */
  isLoading = false;
  /** album form */
  form: FormGroup;
  /** array of files to upload */
  filesToUpload: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public albumService: AlbumsService,
    private router: Router,
    ) {
      this.buildForm();
    }

  /**
   * Set the form to create an album.
   *
   * @memberof AlbumCreateComponent
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(18)]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  /**
   * Function called after the user picked image(s).
   * Get the array of files to upload,
   * Initialize imagePreview constante,
   * Get through every files to upload, read them, check their format,
   * If format is valid, push the image source to the array of imagePreview,
   *
   * @param {Event} event
   * @memberof AlbumCreateComponent
   */
  onImagePicked(event: Event): void {
    this.filesToUpload = (event.target as HTMLInputElement).files as unknown as Array<File>;
    this.imagePreview = [];
    const fileList = this.filesToUpload.length;
    for (let i = 0; i <= fileList - 1; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result.toString();
        if (result.startsWith('data:image/jpeg') || result.startsWith('data:image/jpg') || result.startsWith('data:image/png')) {
          this.imagePreview.push(reader.result);
        }
      };
      reader.readAsDataURL(this.filesToUpload[i]);
    }
  }

  /**
   * Function called to create the album.
   * Set loading on true,
   * Check the form manually,
   * Save the new album and redirect to albums list,
   * Reset the form and set loading on false (in case of error),
   *
   * @returns {Promise<void>}
   * @memberof AlbumCreateComponent
   */
  async saveAlbum(): Promise<void> {
    this.isLoading = true;

    /** checking that form is correctly filled */
    if (this.form.value.title && this.form.value.title !== 'null' && this.filesToUpload.length > 0) {
      try {
        await this.albumService.addAlbum(
          this.form.value.title,
          this.filesToUpload
        ).then(() => {
          this.router.navigate(['/albums/']);
        });
      } catch (e) {
          /** debugging */
          console.error(e);
      }
    }

    this.form.reset();
    this.isLoading = false;
  }
}
