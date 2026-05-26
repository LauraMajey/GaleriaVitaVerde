import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';

  // Credencial por defecto del Administrador
  private ADMIN_USER = 'admin@vitaverde.com';
  private ADMIN_PASS = 'ucompensar2026';

  constructor(
    private router: Router, 
    private toastController: ToastController
  ) { }

  async btnEntrarLogin() {
    if (!this.email || !this.password) {
      await this.presentToast('Por favor, ingrese su correo y contraseña');
      return;
    }

    // 1. Intentar buscar si hay un usuario registrado localmente en la memoria
    const usuarioRegistradoStr = localStorage.getItem('usuario_vitaverde');
    let cuentaValida = false;

    if (usuarioRegistradoStr) {
      const usuarioLocal = JSON.parse(usuarioRegistradoStr);
      // Validamos si lo que escribió coincide con el registro previo
      if (this.email === usuarioLocal.email && this.password === usuarioLocal.password) {
        cuentaValida = true;
      }
    }

    // 2. Validar contra el Administrador fijo o la cuenta del registro local
    if ((this.email === this.ADMIN_USER && this.password === this.ADMIN_PASS) || cuentaValida) {
      
      await this.presentToast('Autenticación Exitosa. Bienvenido a VitaVerde');
      
      await Preferences.set({ 
        key: 'token_jwt', 
        value: 'Mock-JWT-Token-Compensar-2026' 
      });

      this.router.navigate(['/tabs'], { replaceUrl: true });

    } else {
      await this.presentToast('Error: Credenciales inválidas. Usuario no encontrado.');
    }
  }

  irACrearCuenta() { 
    this.router.navigate(['/create-user'], { replaceUrl: true }); 
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({ 
      message: msg, 
      duration: 2000, 
      position: 'bottom', 
      color: 'dark' 
    });
    await toast.present();
  }
}