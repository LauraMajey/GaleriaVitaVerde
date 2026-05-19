import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

// Interfaz para definir la estructura de cada foto de la galería
export interface UserPhoto {
  filepath: string;
  webviewPath: any;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'galeria_fotos';

  constructor() {}

  // Lógica principal para tomar la fotografía desde el emulador o dispositivo
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera, // Invoca la cámara nativa del hardware
      quality: 100
    });

    // Guardar la foto en el arreglo en memoria
    this.photos.unshift({
      filepath: 'foto_' + new Date().getTime() + '.jpg',
      webviewPath: capturedPhoto.webPath
    });

    // Persistir la colección de fotos de manera local
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  // Carga la colección de fotos persistidas localmente al iniciar la vista
  public async loadSavedPhotos() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = value ? JSON.parse(value) : [];
  }
}