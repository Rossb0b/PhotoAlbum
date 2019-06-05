import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Album } from '../album.interface';
import { AlbumsService } from '../albums.service';
import { mimeType } from 'src/app/posts/post-create/mime-type.validator';

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

    buildForm(): void {
      this.form = this.formBuilder.group({
        title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(18)]}),
        image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
      });
    }

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

    async saveAlbum(): Promise<void> {
      this.isLoading = true;

      try {
        await this.albumService.addAlbum(
          this.form.value.title,
          this.filesToUpload
        );
        /** To try !! */
        // this.router.navigate(['/albums/']);
      } catch (e) {
        /** debugging */
        console.error(e)
      }

      this.form.reset();
      this.isLoading = false;
    }
}
