import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Manejo del estado del carrito en tiempo real con un BehaviorSubject
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

 
  async cargarCarrito() {
    const { value } = await Preferences.get({ key: 'carrito_vitaverde' });
    if (value) {
      this.cartItemsSubject.next(JSON.parse(value));
    } else {
      this.cartItemsSubject.next([]);
    }
  }


  async agregarAlCarrito(productoNuevo: any) {
    const carritoActual = this.cartItemsSubject.value;
    
    // Buscamos si el producto ya existe en la lista del carrito
    const index = carritoActual.findIndex(item => item.id === productoNuevo.id);

    if (index > -1) {
      // Si ya existe, reemplazamos el producto entero con su nueva cantidad actualizada
      carritoActual[index] = productoNuevo;
    } else {
      // Si es la primera vez que se añade, lo metemos al arreglo
      carritoActual.push(productoNuevo);
    }

    // Actualizamos el estado de la app y lo guardamos permanentemente 
    this.cartItemsSubject.next([...carritoActual]);
    await Preferences.set({
      key: 'carrito_vitaverde',
      value: JSON.stringify(carritoActual)
    });
  }

  // Método para remover o bajar a 0 unidades un producto
  async removerProducto(productoId: number) {
    let carritoActual = this.cartItemsSubject.value;
    
    // Filtramos la lista para quitar el producto seleccionado
    carritoActual = carritoActual.filter(item => item.id !== productoId);

    this.cartItemsSubject.next([...carritoActual]);
    await Preferences.set({
      key: 'carrito_vitaverde',
      value: JSON.stringify(carritoActual)
    });
  }

  // Calcula el dinero total acumulado (Usado por el Tab3 del Carrito)
  calcularTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + (item.precio * (item.cantidad || 1));
    }, 0);
  }

  // Vacía el carrito por completo tras un pago exitoso
  async vaciarCarrito() {
    this.cartItemsSubject.next([]);
    await Preferences.remove({ key: 'carrito_vitaverde' });
  }
}