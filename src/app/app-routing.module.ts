import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuariosComponent } from './Complementos/crear-usuarios/crear-usuarios.component';
import { LoginComponent } from './Complementos/login/login.component';
import { RecuperarPasswordComponent } from './Complementos/recuperar-password/recuperar-password.component';
import { UsuariosComponent } from './Complementos/usuarios/usuarios.component';
import { VerificarCorreoComponent } from './Complementos/verificar-correo/verificar-correo.component';
import {NavbarComponent} from './Complementos/navbar/navbar.component';
import { ClientesComponent } from './Complementos/clientes/clientes.component';
import { CrearClientesComponent } from './Complementos/crear-clientes/crear-clientes.component';
import { InventarioComponent } from './Complementos/inventario/inventario.component';
import { CrearProductoComponent } from './Complementos/crear-producto/crear-producto.component';
import { EntradaProductoComponent } from './Complementos/entrada-producto/entrada-producto.component';
import { FacturacionComponent } from './Complementos/facturacion/facturacion.component';
import {CarteraComponent} from './Complementos/cartera/cartera.component';
import { ReportesComponent } from './Complementos/reportes/reportes.component';
import { ReporteEntradasComponent } from './Complementos/reportes/reporte-entradas/reporte-entradas.component';
import { ReporteVentasComponent } from './Complementos/reportes/reporte-ventas/reporte-ventas.component';





const routes: Routes = [
  {path: '', redirectTo: 'navbar', pathMatch: 'full'},
  {path: 'navbar', component: NavbarComponent},
  {path: 'login', component:LoginComponent},
  {path: 'verificar-correo', component: VerificarCorreoComponent},
  {path: 'recuperar-contraseña', component: RecuperarPasswordComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'crear-usuarios', component: CrearUsuariosComponent},
  {path: 'crear-clientes', component: CrearClientesComponent},
  {path: 'crear-producto', component: CrearProductoComponent },
  {path: 'edit-Usuario/:id', component: CrearUsuariosComponent},
  {path: 'edit-Cliente/:id', component: CrearClientesComponent},
  {path: 'edit-Producto/:id', component: CrearProductoComponent},
  {path: 'clientes', component:ClientesComponent},
  {path: 'inventario', component:InventarioComponent},
  {path: 'entrada-producto/:id', component:EntradaProductoComponent},
  {path: 'facturacion', component:FacturacionComponent},
  {path: 'cartera/:id', component: CarteraComponent},
  {path: 'reportes', component: ReportesComponent},
  {path: 'reporte-entradas', component: ReporteEntradasComponent},
  {path: 'reporte-ventas', component: ReporteVentasComponent},


  {path: '**', redirectTo: 'navbar', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
