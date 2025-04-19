import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IndexedDBService } from '../servicios/indexed-db.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MascotasComponent } from '../mascotas/mascotas.component';
import { MascotaEditComponent } from '../mascota-edit/mascota-edit.component';
import { MascotaDeleteComponent } from '../mascota-delete/mascota-delete.component';
import { MascotaShowComponent } from '../mascota-show/mascota-show.component';

@Component({
  selector: 'app-mascotas-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascotas-list.component.html',
  styleUrl: './mascotas-list.component.css'
})
export class MascotasListComponent {
  mascotas = signal<any[]>([]);
  miUsuario:any;
  constructor(private dbServicio : IndexedDBService, private modalService: NgbModal) {
    this.cargarMascotas();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cargarMascotas();
    console.log(this.mascotas);
  }

  cargarMascotas() {
    this.dbServicio.obtenerMascotas()
      .then((lista) => { this.mascotas.set(lista) });

      const idUsuario = Number(sessionStorage.getItem('usuarioId'));
          this.dbServicio.miUsuario(idUsuario)
            .then(usuario => {
              this.miUsuario=usuario;
            })
            .catch(error => {
              console.error('Error al recuperar el usuario:', error);
           });
  }
  editMascota(mascota:any){
    const modalRef = this.modalService.open(MascotaEditComponent, { size: 'md' });
    modalRef.componentInstance.mascota = mascota;

    modalRef.result.then((nuevaMascota) => {
      if (nuevaMascota) {
        console.log(nuevaMascota);
        this.mascotas.update(mascotasActuales => {
          return mascotasActuales.map(item =>
            item.id === nuevaMascota.id ? nuevaMascota : item
          );
        });
      }
    }).catch((error) => {
      console.log('Modal cancelado o cerrado sin guardar', error);
    });
  }
  deleteMascota(mascota: any) {
    const modalRef = this.modalService.open(MascotaDeleteComponent, { size: 'md' });
    modalRef.componentInstance.mascota = mascota;
    modalRef.result.then((id) => {
      if (id) {
        this.mascotas.update(mascotasActuales =>
          mascotasActuales.filter(item => item.id !== mascota.id)
        );
      }
    }).catch((error) => {
      console.log('Modal cancelado o cerrado sin guardar', error);
    });
  }
  verMascota(mascota:any){
    const modalRef = this.modalService.open(MascotaShowComponent, { size: 'md' });
    modalRef.componentInstance.mascota = mascota;
  }
  anadirMascota(){
    const modalRef = this.modalService.open(MascotasComponent, { size: 'md' });

    modalRef.result.then((nuevaMascota) => {
      if (nuevaMascota) {
        this.mascotas.update(mascotasActuales => [...mascotasActuales, nuevaMascota]);
      }
    }).catch((error) => {
      console.log('Modal cancelado o cerrado sin guardar', error);
    });
  }
}
