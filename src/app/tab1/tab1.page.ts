import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  username = '';
  password = '';
  tokenActivo: string | null = null;

  constructor(private authService: AuthService) {
    // Escuchar si ya hay un token guardado localmente
    this.authService.currentUser.subscribe(token => {
      this.tokenActivo = token;
    });
  }

  // Ejecutar el inicio de sesión simulado
  onLogin() {
    if (this.username && this.password) {
      // Enviamos los datos a la API simulada
      this.authService.login(this.username, this.password).subscribe({
        next: (res) => {
          console.log('Login exitoso, token recibido:', res.token);
          alert('¡Autenticación Exitosa! Token JWT almacenado localmente.');
        },
        error: (err) => {
          console.error('Error en login', err);
          alert('Error al conectar con la API REST');
        }
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  // Cerrar sesión y borrar el JWT
  onLogout() {
    this.authService.logout();
    this.username = '';
    this.password = '';
    alert('Sesión cerrada. Token eliminado del almacenamiento local.');
  }
}