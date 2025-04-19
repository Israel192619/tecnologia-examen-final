import { Component, NgModule, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginComponent } from './auth/login/login.component';
import { SesionService } from './servicios/sesion.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from './servicios/indexed-db.service';
import { MascotasComponent } from './mascotas/mascotas.component';
import { MascotasListComponent } from './mascotas-list/mascotas-list.component';
import { SolicitudCrearComponent } from './adopciones/solicitud-crear/solicitud-crear.component';
import { MostrarMascotasFiltradaComponent } from './mostrar-mascotas-filtrada/mostrar-mascotas-filtrada.component';
import { SolicitudListComponent } from './adopciones/solicitud-list/solicitud-list.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, /* UsuariosComponent, */ LoginComponent, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //listaMascotasFiltradas: any[] = [];
  categorias = ['Perro', 'Gato', 'Hámster', 'Tortugas', 'Peces' ];
  mostrarLogin = false;
  mascotaSeleccionada:any = '';
  constructor(private indexdb: IndexedDBService,
    private router: Router,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.categorias;
  }
  cargarMascotas(categoria:any) {
    const modalRef = this.modalService.open(MostrarMascotasFiltradaComponent, {centered: true,size:'lg'});
    modalRef.componentInstance.categoria = categoria;
    modalRef.componentInstance.mascotaEnviada.subscribe((mascota:any)=>{
    this.mascotaSeleccionada = mascota;
    console.log(this.mascotaSeleccionada);
    });
  }
  title = 'tecnoexm-angular';
  darAdopcion(){
    if (!this.indexdb.estaLogueado()) {
      this.modalService.open(LoginComponent);
    }else{
      this.modalService.open(MascotasComponent);
    }
  }
  abrirLogin() {
    this.modalService.open(LoginComponent);
  }

  cerrarLogin() {
    this.mostrarLogin = false;
  }
  logout(){
    this.indexdb.cerrarSesion();
  }
  listaMascotas(){
    this.modalService.open(MascotasListComponent, { size: 'lg' });
  }
  isLogueado(){
    return this.indexdb.estaLogueado();
  }
  iniciarSesion(){
    this.modalService.open(LoginComponent);
  }
  miPerfil(){
    const idUsuario = Number(sessionStorage.getItem('usuarioId'));
    this.indexdb.miUsuario(idUsuario)
      .then(usuario => {
        console.log('Usuario encontrado:', usuario);
        const modalRef = this.modalService.open(UsuariosComponent, { size: 'md' });
        modalRef.componentInstance.usuario = usuario;
      })
      .catch(error => {
        console.error('Error al recuperar el usuario:', error);
      });

  }
  adopar(){
    /* if (!this.indexdb.estaLogueado()) {
      this.modalService.open(LoginComponent);
    }else{
      const idUsuario = Number(sessionStorage.getItem('usuarioId'));
      this.indexdb.miUsuario(idUsuario)
        .then(usuario => {
          console.log('Usuario encontrado:', usuario);
          const modalRef = this.modalService.open(SolicitudCrearComponent, { size: 'md' });
          modalRef.componentInstance.usuario = usuario;
          modalRef.componentInstance.tipoOferta = 'solicitud';
        })
        .catch(error => {
          console.error('Error al recuperar el usuario:', error);
        });
    } */
      this.modalService.open(QuienesSomosComponent,{size:'lg'});
  }
  adoptar(mascotaSeleccionada:any){
    if (!this.indexdb.estaLogueado()) {
      this.modalService.open(LoginComponent);
    }else{
      const idUsuario = Number(sessionStorage.getItem('usuarioId'));
      this.indexdb.miUsuario(idUsuario)
        .then(usuario => {
          console.log('Usuario encontrado:', usuario);
          const modalRef = this.modalService.open(SolicitudCrearComponent, { size: 'md' });
          modalRef.componentInstance.usuario = usuario;
          modalRef.componentInstance.animalId = mascotaSeleccionada.id;
          modalRef.componentInstance.tipoOferta = 'solicitud';
        })
        .catch(error => {
          console.error('Error al recuperar el usuario:', error);
        });
    }
  }
  ubicacion(){
    this.modalService.open(UbicacionComponent,{size:'lg'});
  }
  misSolicitudes(){
    const modalRef =  this.modalService.open(SolicitudListComponent,{size:'lg'});
    modalRef.componentInstance.solicitudEnviada.subscribe((solicitudEnviada:any)=>{
      console.log(solicitudEnviada,'sol');
      if(this.mascotaSeleccionada.id = solicitudEnviada.animalID){
        console.log('son iguales');
        this.mascotaSeleccionada = '';
      }

    });
  }
}
