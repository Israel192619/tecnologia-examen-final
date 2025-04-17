import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginComponent } from './auth/login/login.component';
import { SesionService } from './servicios/sesion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UsuariosComponent, LoginComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  mostrarLogin = false;
  constructor(private sesionService: SesionService, private router: Router) {}
  title = 'tecnoexm-angular';
  darAdopcion(){
    if (!this.sesionService.estaLogueado()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  cerrarLogin() {
    this.mostrarLogin = false;
  }
}
