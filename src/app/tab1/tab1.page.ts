import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit {
  
  tokenActivo = false;
  carritoActual: any[] = [];

 
  productos: Producto[] = [
    { id: 1, nombre: 'Aguacate Hass', precio: 4500, categoria: 'Frutas', imagen: 'assets/product_aguacate.png' },
    { id: 2, nombre: 'Ahuyama Criolla', precio: 2300, categoria: 'Verduras', imagen: 'assets/product_ahuyama.png' },
    { id: 3, nombre: 'Banano Urabá', precio: 1800, categoria: 'Frutas', imagen: 'assets/product_banano.png' },
    { id: 4, nombre: 'Brócoli Fresco', precio: 3500, categoria: 'Verduras', imagen: 'assets/product_broccoli.png' },
    { id: 5, nombre: 'Lechuga Crespa', precio: 2800, categoria: 'Verduras', imagen: 'assets/product_lechuga.png' },
    { id: 6, nombre: 'Mandarina Oneco', precio: 3200, categoria: 'Frutas', imagen: 'assets/product_mandarina.png' },
    { id: 7, nombre: 'Zanahoria Premium', precio: 2100, categoria: 'Verduras', imagen: 'assets/product_zanahoria.png' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  async ngOnInit() {
    // 1. Validar la existencia del Token seguro local
    const { value } = await Preferences.get({ key: 'token_jwt' });
    if (value) {
      this.tokenActivo = true;
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
    }

    // 2. Escuchar cambios del carrito en tiempo real
    this.cartService.cartItems$.subscribe(items => {
      this.carritoActual = items;
    });
  }

  obtenerCantidad(productoId: number): number {
    const item = this.carritoActual.find(i => i.id === productoId);
    return item ? (item.cantidad || 0) : 0;
  }


  cambiarCantidad(producto: Producto, cambio: number) {
    const cantidadActual = this.obtenerCantidad(producto.id);
    const nuevaCantidad = cantidadActual + cambio;

    if (nuevaCantidad <= 0) {
      this.cartService.removerProducto(producto.id);
    } else {
      // Creamos la estructura con la propiedad de cantidad explícita
      const productoConCantidad = { 
        ...producto, 
        cantidad: nuevaCantidad 
      };
      this.cartService.agregarAlCarrito(productoConCantidad);
    }
  }

  async onLogout() {
    await Preferences.remove({ key: 'token_jwt' });
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}