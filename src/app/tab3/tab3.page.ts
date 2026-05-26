import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Producto } from '../models/producto.model';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {
  carrito: Producto[] = [];

  constructor(
    private cartService: CartService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Escucha el estado del carrito guardado en Preferences
    this.cartService.cartItems$.subscribe(items => {
      this.carrito = items;
    });
  }

  eliminarProducto(id: number) {
    this.cartService.removerProducto(id);
  }

  obtenerTotal(): number {
    return this.cartService.calcularTotal();
  }

  async procesarPago() {
    const totalPedido = this.obtenerTotal();

    // Despliega una alerta nativa para confirmar la transacción del fruver
    const alert = await this.alertController.create({
      header: 'Confirmar Pago',
      subHeader: `Total: $${totalPedido.toLocaleString('es-CO')}`,
      message: '¿Deseas finalizar la compra de tus productos orgánicos con el saldo de tu cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Pagar',
          handler: async () => {
            // Acción tras pagar: Vacía el carrito local y lanza confirmación
            await this.cartService.vaciarCarrito();
            const toast = await this.toastController.create({
              message: '¡Pago Exitoso! Tu pedido de VitaVerde va en camino.',
              duration: 2000,
              color: 'success',
              position: 'bottom'
            });
            await toast.present();
          }
        }
      ]
    });

    await alert.present();
  }
}