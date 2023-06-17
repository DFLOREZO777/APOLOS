import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FacturacionService } from 'src/app/Servicios/facturacion.service';
import { ProductoService } from 'src/app/Servicios/producto.service'
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/Servicios/cliente.service';
import { CarteraService } from 'src/app/Servicios/cartera.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { NavBarService } from 'src/app/Servicios/nav-bar.service';
import { query } from 'firebase/firestore';

declare var window: any;

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

  loading = false;
  pagoDetalle: any[] = [];
  arregloDetalle: any[] = [];
  cliente: any[] = [];
  clientes: any[] = [];
  productos: any[] = [];
  dataUser: any;
  fecha: any;
  numCli: any;
  crearFactura: FormGroup;
  detallesF: FormGroup;
  clienteD: FormGroup;
  pago: FormGroup;
  queryRef!: string;
  remIni = 0;
  lastSalida : number = 0;
  formModal: any;
  productoModal: any;
  clientesModal: any;
  key: any = [];
  cartera: any = [];
  total = 0;
  validor = false;
  isDisabled = true;
  query : string = '';
  query1 : string = '';
  
  //@Output() variableActualizada : EventEmitter<string> = new EventEmitter<string>();


  constructor(fb: FormBuilder, private toastr: ToastrService, private facturacionService: FacturacionService,
    private productoService: ProductoService, private clienteServices: ClienteService, private afAuth: AngularFireAuth,
    private carteraService: CarteraService, private router: Router, private usuarioServices: UsuarioService,
    public navBarService: NavBarService) {

    this.crearFactura = fb.group({
      remision: ['', Validators.required],
      usuario: ['', Validators.required],
      fecha: ['', Validators.required],
      tipoFact: ['', Validators.required],
      cliente: [''],
      detalle: [''],
      pago: ['']
    });

    this.detallesF = fb.group({
      nombre: [''],
      referencia: [''],
      precio: [''],
      stock: [''],
      cantidad: [''],
      total: [''],
    });

    this.clienteD = fb.group({
      documento: [''],
      nombre: [''],
      telefono: ['']
    });

    this.pago = fb.group({
      metodo: [''],
      total: [''],
      recibe: [''],
      cambio: [''],
      saldo: ['']
    });

  }

  ngOnInit(): void {
    this.remisionIni();
    //this.getClientes();
    this.getUsuario();
    this.fechaHora();
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
    this.productoModal = new window.bootstrap.Modal(
      document.getElementById("modalProductos")
    );
    this.clientesModal = new window.bootstrap.Modal(
      document.getElementById("modalClientes")
    );
  }



  fechaHora() {
    this.fecha = new Date();
  }



  remisionIni() {

    this.remIni = this.crearFactura.value.remision;
    if (this.remIni == 0 || null) {
      this.remIni = 1;
    }
    if (this.remIni !== null) {
      this.autoIncrement();
    }
    // console.log(this.remIni)
  }

  autoIncrement() {
    let remision: any = [];
    this.loading = false;
    this.facturacionService.getFacturaRem().subscribe(data => {
      data.forEach((element: any) => {
        remision.push({
          remi: parseInt(element.payload.doc.data().remision)
        });
        //console.log(remision)
      });
      this.remIni = remision[0].remi + 1;
      // (<HTMLInputElement>document.getElementById("remision")).value = String((remision[0].remi)+1);

    });

  }

  //llamar usuario de firebase 
  getUsuario() {
    this.afAuth.user.subscribe(data => {
      let dato = data?.email;
      if (dato !== null && dato !== undefined) {
        this.getRol(dato);
      }
    });
  }

  getRol(dato: string) {

    this.usuarioServices.buscarUsuario(dato).subscribe(data => {
      data.forEach((element: any) => {
        this.dataUser = element.data().nombre
      });
    });
  }

  // Llamar Cliente
  callCliente(event: any) {
    this.queryRef = event.target.value;
    if (this.queryRef !== null) {
      while (this.cliente.length > 0) {
        this.cliente = [];
      }
      this.clienteServices.getIdCliente(this.queryRef).subscribe(data => {
        data.forEach((element: any) => {
          this.cliente.push({
            id: element.payload.doc.id,
            documento: element.payload.doc.data().documento,
            nombre: element.payload.doc.data().nombre,
            telefono: element.payload.doc.data().telefono,
            monto: element.payload.doc.data().monto,
            abono: element.payload.doc.data().abono,
            saldo: element.payload.doc.data().saldo,
          });
        });
      });
      this.clienteServices.getClienteDoc(this.queryRef).subscribe(cli => {
        cli.forEach((element: any) => {
          //console.log(element.data());
          this.clienteD.setValue({

            documento: element.data().documento,
            nombre: element.data().nombre,
            telefono: element.data().telefono

          });
        });
      });
    }
  }

  clearClie() {
    this.clienteD.reset();
    this.cliente = [];
    //console.log("vaciado")
  }


  // llamar el producto de Firebase
  callProducto(event: any) {
    this.queryRef = event.target.value;
    if (this.queryRef != null) {
      this.facturacionService.getProductoRef(this.queryRef).subscribe(prod => {

        prod.forEach((element: any) => {
          //console.log(element.data());
          this.detallesF.setValue({

            nombre: element.data().nombre,
            referencia: element.data().referencia,
            precio: element.data().precio,
            stock: element.data().stock,
            cantidad: 0,
            total: 0,
          });
          this.lastSalida = element.data().salida;
          //console.log(this.lastSalida)
        });
      });
    }
  }

  //calcular precio total del detalle de producto
  calcularTotal(event: any) {
    let cantidad = event.target.value;
    // console.log(cantidad)
    let multi = 0;

    cantidad = parseInt(cantidad);
    if (cantidad < 0) {
      this.toastr.error('la cantidad no puede ser menor que 0', 'Error de Información', {
        positionClass: 'toast-bottom-right'
      });
    }
    if (!Number(cantidad)) {
      this.detallesF.value.cantidad = 0;
    }
    else {
      var b = (<HTMLInputElement>document.getElementById("precioUni")).value;
      //console.log(b)
      multi = parseFloat(cantidad) * parseFloat(b);
      (<HTMLInputElement>document.getElementById("total")).value = String(multi);
    }

  }

  //Obtener id de producto por medio de referencia
  referenciaId(event: any) {
    while (this.key.length > 0) {
      this.key = [];
      //console.log("Array vaciado")
    }
    this.queryRef = event.target.value;
    this.productoService.getIdProducto(this.queryRef).subscribe(data => {
      data.forEach((element: any) => {
        this.key.push({
          id: element.payload.doc.id,
          salida: element.payload.doc.data().salida
        });
      });
    });
    // console.log(this.key);

  }

  //Redibujar tabla de detalles 
  agregarDetalle(producto: any) {


    const resul = this.arregloDetalle.find((detalle) => {
      if (producto.referencia == detalle.referencia) {
        return detalle;
      }
    });

    //console.log(resul)

    if (resul) {
      this.arregloDetalle = this.arregloDetalle.map((detalle) => {
        if (detalle.referencia == producto.referencia) {
          // console.log("Cumple la condicion")
          return {
            id: detalle.id,
            nombre: detalle.nombre,
            referencia: detalle.referencia,
            precio: detalle.precio,
            salida: detalle.salida + producto.cantidad,
            stock: detalle.stock - producto.cantidad,
            cantidad: detalle.cantidad + producto.cantidad,
            total: (detalle.cantidad + producto.cantidad) * detalle.precio
          }
        }
        return detalle;
      });
    } else {
      //console.log("No cumple la condicion")
      this.arregloDetalle.push(producto);
    }
  }

  // agregar el producto a la lista de factura
  addProducto() {

    var producto: any = {


      id: this.key[0].id,
      nombre: this.detallesF.value.nombre,
      referencia: this.detallesF.value.referencia,
      precio: this.detallesF.value.precio,
      salida: this.key[0].salida + this.detallesF.value.cantidad,
      stock: parseFloat(this.detallesF.value.stock) - parseFloat(this.detallesF.value.cantidad),
      cantidad: this.detallesF.value.cantidad,
      total: parseFloat(this.detallesF.value.cantidad) * parseFloat(this.detallesF.value.precio)
    }

    var salida: any = {
      salida: this.lastSalida + parseInt(producto.cantidad),
      stock: producto.stock
    }

    if (producto.cantidad < 0) {
      this.toastr.error('La cantidad no puede ser negativa', 'Error de Información', {
        positionClass: 'toast-bottom-right'
      });
    } else if (!Number(producto.cantidad) || !Number(producto.precio)) {
      this.toastr.error('El valor digitado no es un numero', 'Error en Cantidad o Precio', {
        positionClass: 'toast-bottom-right'
      });
    } else if (producto.cantidad > this.detallesF.value.stock){
      this.toastr.error('La cantidad digitada es mayor al numero de existencias', 'Error cantidad superior', {
        positionClass: 'toast-bottom-right'
      });
    } else {
      this.productoService.actualizarProducto(this.key[0].id, salida).then(() => {
        this.toastr.info('Articulo agregado', 'Agregado', {
          positionClass: 'toast-bottom-right'
        });
      });

      this.agregarDetalle(producto);
      this.detallesF.reset();
    }

  }

  clearProd() {
    this.detallesF.reset();
  }

  redibujarTabla() {
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    if (cuerpoTabla != null) {
      this.loading = true;
      cuerpoTabla.innerHTML = "";
    }
  }

  // Eliminiar articulos de venta en la factura
  eliminarProducto(dato: string) {
    const eliminar = this.arregloDetalle.findIndex(p => p.referencia === dato);
    const cantidad = parseInt(this.arregloDetalle[eliminar].cantidad);

    const salida = parseInt(this.arregloDetalle[eliminar].salida);
    const id = this.arregloDetalle[eliminar].id;
    const stock = parseInt(this.arregloDetalle[eliminar].stock);

    const removido: any = {
      salida: salida - cantidad,
      stock: stock + cantidad
    }
    this.productoService.actualizarProducto(id, removido).then(() => {
      this.toastr.info('Se elimino articulo/s para la venta', 'Eliminado');

    });

    this.arregloDetalle.splice(eliminar, 1);

  }


  // Calcular el total de los productos en la factura
  totalTabla() {
    this.total = 0;
    let total = 0

    this.arregloDetalle.forEach(p => {
      total += p.precio * p.cantidad;

    });

    this.total = total;
    return total;
  }

  calculoCambio(event: any) {

    let recibe = event.target.value;
    let cambio = this.total - recibe;
    let saldo = 0;

    let value = (<HTMLInputElement>document.getElementById("metodo")).value;

    const pagos: any = {
      metodo: this.pago.value.metodo,
      total: this.total,
      recibe: this.pago.value.recibe,
      cambio: cambio,
      saldo: saldo
    }
    if (!value) {
      this.isDisabled = true;
      this.toastr.info('Por favor seleccione el metodo de pago', 'Metodo de Pago', {
        positionClass: 'toast-bottom-right'
      });
    }
    if (!Number(recibe)) {
      recibe = 0;
      this.isDisabled = true;
      this.toastr.error('El valor ingresado no es valido', 'Error de información', {
        positionClass: 'toast-bottom-right'
      });
    } if (recibe < 0) {
      this.isDisabled = true;
      this.toastr.error('El valor recibido no puede ser negativo', 'Error de información', {
        positionClass: 'toast-bottom-right'
      });
    }

    if (Number(recibe) && recibe > 0) {
      this.isDisabled = false;
    }

    while (this.pagoDetalle.length > 0) {
      this.pagoDetalle = [];
      //console.log("Array vaciado");
    }
    //Calculos de cambio y saldo
    if (this.pago.value.metodo !== 'Efectivo') {
      cambio = 0;
    }

    if (this.total > recibe) {
      cambio = 0;
      (<HTMLInputElement>document.getElementById("cambio")).value = String(cambio);
      saldo = this.total - recibe;
      (<HTMLInputElement>document.getElementById("saldo")).value = String(saldo);

      if (this.crearFactura.value.tipoFact !== 'Apartado' && saldo > 0) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    }
    if (recibe > this.total) {
      saldo = 0;
      (<HTMLInputElement>document.getElementById("saldo")).value = String(saldo);
    }

    if (cambio < 0) {
      cambio = -1 * cambio;
      (<HTMLInputElement>document.getElementById("cambio")).value = String(cambio);
    } else {
      (<HTMLInputElement>document.getElementById("cambio")).value = String(cambio);
      //console.log(cambio)
    }



    this.pagoDetalle.push(pagos);

  }

  // Ventana Modal
  openModal() {
    let value = (<HTMLInputElement>document.getElementById("tipoFac")).value
    // console.log(value)
    if (!value) {
      this.toastr.info('Por favor seleccione el tipo de factura', 'Tipo de Factura', {
        positionClass: 'toast-bottom-right'
      });
    } else {
      this.formModal.show();
    }
  }

  doSomething() {
    this.formModal.hide();
    this.pago.reset();
    this.isDisabled = true;
  }

  agregarFactura() {
    const factura: any = {
      remision: this.remIni,
      usuario: this.dataUser,
      tipoFac: this.crearFactura.value.tipoFact,
      fecha: this.fecha,
      cliente: this.cliente,
      detalle: this.arregloDetalle,
      pago: this.pagoDetalle
    }


    if (!Number(factura.pago[0].recibe)) {
      this.toastr.error('El valor recibido no es valido', 'Error Detectado', {
        positionClass: 'toast-bottom-rigth'
      });
      factura.pago[0].recibe = 0;
      this.isDisabled = false;
    }
    else {
      this.loading = true;
      this.formModal.hide();
      this.facturacionService.agregarFactura(factura).then(() => {
        this.toastr.success('Se genero factura exitosamente', 'Factura Registrada', {
          positionClass: 'toast-bottom-rigth'
        });
        this.isDisabled = true;
        this.crearFactura.reset();
        this.redibujarTabla();
        this.router.navigate(['/navbar'])
      }).catch(error => {
        this.toastr.error((error.code), 'Error');
        console.log(error);
        this.loading = false;
      });

    }
  }

  carteraCli() {
    //console.log(this.pagoDetalle);

    const cartera: any = {
      idCli: this.cliente[0].id,
      documento: this.cliente[0].documento,
      cliente: this.cliente[0].nombre,
      remision: this.remIni,
      tipoFac: this.crearFactura.value.tipoFact,
      monto: this.total,
      abono: this.pagoDetalle[0].recibe,
      saldo: this.total - this.pagoDetalle[0].recibe,
      fecha: this.fecha
    }
    if (cartera.saldo < 0) {
      cartera.saldo = 0;
    }

    const datos: any = {
      monto: this.cliente[0].monto + cartera.monto,
      abono: parseFloat(this.cliente[0].abono) + parseFloat(cartera.abono),
      saldo: this.cliente[0].saldo + cartera.saldo
    }
    if (cartera.tipoFac === 'Venta') {
      datos.abono = this.cliente[0].abono;
      datos.saldo = this.cliente[0].saldo;
      datos.monto = this.cliente[0].monto;
      cartera.abono = 0;
    }

    this.carteraService.agregarCartera(cartera).then(() => {
      this.toastr.success('Agregado a cartera de cliente', 'Cartera exitosa', {
        positionClass: 'toast-bottom-rigth'
      });
    });

    this.clienteServices.actualizarCliente(this.cliente[0].id, datos).then(() => {

    })
  }

  conCartera() {
    if (this.cliente.length > 0) {
      //console.log(this.pagoDetalle)
      this.agregarFactura();
      this.carteraCli();

      //console.log("cumple condicion")


    } else {
      this.cliente.push({
        nombre: 'Generico'
      });
      this.agregarFactura();

      // console.log("no cumple condicion")
      // console.log(this.cliente)
    }
  }

  checkCliente(dato : string){
    const cliente = this.clientes.findIndex( c => c.id === dato);
    //console.log(this.clientes[cliente].id)
    this.clienteD.setValue({
      documento :this.clientes[cliente].documento,
      nombre : this.clientes[cliente].nombre,
      telefono : this.clientes[cliente].telefono
    });
    this.cliente.push({
      id: this.clientes[cliente].id,
      documento: this.clientes[cliente].documento,
      nombre: this.clientes[cliente].nombre,
      telefono: this.clientes[cliente].telefono,
      monto: this.clientes[cliente].monto,
      abono: this.clientes[cliente].abono,
      saldo: this.clientes[cliente].saldo,
    });
    this.closeModalClientes();
  }

  checkProductos(dato : string){
    this.key = [];
    const producto = this.productos.findIndex( p => p.id === dato);
    //console.log(this.clientes[cliente].id)
    this.detallesF.setValue({
      nombre : this.productos[producto].nombre,
      referencia : this.productos[producto].referencia,
      precio : this.productos[producto].precio,
      stock : this.productos[producto].stock,
      cantidad: 0,
      total: 0
    });
    this.key.push({
      id : this.productos[producto].id,
      salida : this.productos[producto].salida
    })
    this.lastSalida = this.productos[producto].salida;
    console.log(this.key)
    console.log(this.lastSalida)
    this.closeModalProductos();
  }


  openModalProductos() {
    this.productoModal.show();
    this.callProductos();
  }

  openModalClientes() {
    this.callClientes();
    this.clientesModal.show();

  }

  callProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = [];
      data.forEach((element: any) => {
        this.productos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }

  callClientes() {
    this.clienteServices.getClientes().subscribe(data => {
      data.forEach((element: any) => {
        this.clientes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
        //console.log(this.clientes)
      });
    });
  }

  closeModalProductos() {
    this.productoModal.hide();
    this.productos = [];
  }

  closeModalClientes() {
    this.clientesModal.hide();
    this.clientes = [];
  }







}
