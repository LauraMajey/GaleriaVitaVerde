import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'galeria_fotos';

  constructor() {}

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90
    });

    const base64Image = `data:image/jpeg;base64,${capturedPhoto.base64String}`;

    this.photos.unshift({
      filepath: 'foto_' + new Date().getTime() + '.jpg',
      webviewPath: base64Image
    });

    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  public async loadSavedPhotos() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = value ? JSON.parse(value) : [];
  }
}