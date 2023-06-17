import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



//Modulos
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { NgxCurrencyModule } from "ngx-currency";


//Componentes
import { AppComponent } from './app.component';
import { UsuarioService} from './Servicios/usuario.service';
import { UsuariosComponent } from './Complementos/usuarios/usuarios.component';
import { CrearUsuariosComponent } from './Complementos/crear-usuarios/crear-usuarios.component';
import { NavbarComponent } from './Complementos/navbar/navbar.component';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './Complementos/login/login.component';
import { VerificarCorreoComponent } from './Complementos/verificar-correo/verificar-correo.component';
import { RecuperarPasswordComponent } from './Complementos/recuperar-password/recuperar-password.component';
import { ClientesComponent } from './Complementos/clientes/clientes.component';
import { CrearClientesComponent } from './Complementos/crear-clientes/crear-clientes.component';
import { HomeComponent } from './Complementos/home/home.component';
import { InventarioComponent } from './Complementos/inventario/inventario.component';
import { CrearProductoComponent } from './Complementos/crear-producto/crear-producto.component';
import { VentaComponent } from './Complementos/venta/venta.component';
import { EntradaProductoComponent } from './Complementos/entrada-producto/entrada-producto.component';
import { FacturacionComponent } from './Complementos/facturacion/facturacion.component';
import { FiltroUsuarioPipe } from './pipe/filtro-usuario.pipe';
import { CarteraComponent } from './Complementos/cartera/cartera.component';
import { FiltroClientePipe } from './pipe/filtro-cliente.pipe';
import { FiltroCarteraPipe } from './pipe/filtro-cartera.pipe';
import { ReportesComponent } from './Complementos/reportes/reportes.component';
import { ReporteEntradasComponent } from './Complementos/reportes/reporte-entradas/reporte-entradas.component';
import { ReporteVentasComponent } from './Complementos/reportes/reporte-ventas/reporte-ventas.component';


@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    CrearUsuariosComponent,
    NavbarComponent,
    LoginComponent,
    VerificarCorreoComponent,
    RecuperarPasswordComponent,
    ClientesComponent,
    CrearClientesComponent,
    HomeComponent,
    InventarioComponent,
    CrearProductoComponent,
    VentaComponent,
    EntradaProductoComponent,
    FacturacionComponent,
    FiltroUsuarioPipe,
    CarteraComponent,
    FiltroClientePipe,
    FiltroCarteraPipe,
    ReportesComponent,
    ReporteEntradasComponent,
    ReporteVentasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    NgxCurrencyModule
  ],
  providers: [UsuarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
