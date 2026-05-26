import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
  standalone: false
})
export class CreateUserPage implements OnInit {
  name = '';
  email = '';
  password = '';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  async btnRegistrarUsuario() {
    if (this.name && this.email && this.password) {
      
      // Creamos el objeto con los datos que digitaste
      const nuevoUsuario = {
        name: this.name,
        email: this.email,
        password: this.password
      };

      // Lo guardamos en el localStorage para que el Login lo pueda leer
      localStorage.setItem('usuario_vitaverde', JSON.stringify(nuevoUsuario));
      
      const toast = await this.toastController.create({
        message: '¡Registro Exitoso! Ya puedes iniciar sesión.',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      // Volvemos al Login automáticamente
      this.router.navigate(['/login'], { replaceUrl: true });

    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos.',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  irALogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}