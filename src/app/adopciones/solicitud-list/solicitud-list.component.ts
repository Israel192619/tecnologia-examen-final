import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../../servicios/indexed-db.service';
import { SolicitudShowComponent } from '../solicitud-show/solicitud-show.component';
import { SolicitudEditComponent } from '../solicitud-edit/solicitud-edit.component';
import { SolicitudDeleteComponent } from '../solicitud-delete/solicitud-delete.component';

@Component({
  selector: 'app-solicitud-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-list.component.html',
  styleUrl: './solicitud-list.component.css'
})
export class SolicitudListComponent {
  @Output() solicitudEnviada: EventEmitter<any> = new EventEmitter();
  listaSolicitudes: any[] = [];
  miUsuario:any;
  constructor(private dbServicio : IndexedDBService, private modalService: NgbModal){

  }
  ngOnInit(): void {
    this.solicitudes();

  }

  solicitudes() {
    this.dbServicio.obtenerSolicitudesConMascotas()
      .then((datos) => {
        this.listaSolicitudes = datos;
        console.log('Solicitudes cargadas:', this.listaSolicitudes);
      })
      .catch((error) => {
        console.error('Error al obtener solicitudes:', error);
      });

      const idUsuario = Number(sessionStorage.getItem('usuarioId'));
          this.dbServicio.miUsuario(idUsuario)
            .then(usuario => {
              this.miUsuario=usuario;
            })
            .catch(error => {
              console.error('Error al recuperar el usuario:', error);
           });
  }
  editSolicitud(solicitud:any){
    const modalRef = this.modalService.open(SolicitudEditComponent,{size:'md'})
    modalRef.componentInstance.solicitud = solicitud;
    modalRef.componentInstance.solicitudEnviada.subscribe((solicitud:any)=>{
      const index = this.listaSolicitudes.findIndex(s => s.id === solicitud.id);
      if (index !== -1) {
        // Actualizar la solicitud editada
        this.listaSolicitudes[index].motivo = solicitud.motivo;
        //console.log(this.listaSolicitudes);
      }
      });
  }
  deleteSolicitud(solicitudD:any){
    const modalRef = this.modalService.open(SolicitudDeleteComponent,{size:'md'})
    modalRef.componentInstance.solicitud = solicitudD;
    modalRef.componentInstance.solicitudEnviada.subscribe((solicitud:any)=>{
      const index = this.listaSolicitudes.findIndex(s => s.id === solicitudD.id);
      //console.log(solicitudD.id);
      if (index !== -1) {
        //console.log(solicitudD,'soli');
        this.solicitudEnviada.emit(solicitudD);
        //console.log(this.solicitudEnviada,'solicitud enviada');
        this.listaSolicitudes.splice(index, 1);
        //console.log(this.listaSolicitudes);
      }
      });
  }
  verSolicitud(solicitud:any){
    const modalRef = this.modalService.open(SolicitudShowComponent,{size:'md'})
    modalRef.componentInstance.solicitud = solicitud;
  }
  aceptarSolicitud(solicitud:any){
    this.dbServicio.guardarEstadoAdopcion({
      id: solicitud.id,
      estado: 'aceptado'
    }).then(() => {
      const index = this.listaSolicitudes.findIndex(item => item.id === solicitud.id);

      if (index !== -1) {
        this.listaSolicitudes[index].estado = 'aceptado';
      }
    });
  }
  rechazarSolicitud(solicitud:any){
    this.dbServicio.guardarEstadoAdopcion({
      id: solicitud.id, // Usar animalID de la solicitud
      estado: 'rechazado' // El nuevo estado de la solicitud
    }).then(() => {
      const index = this.listaSolicitudes.findIndex(item => item.id === solicitud.id);

      if (index !== -1) {
        this.listaSolicitudes[index].estado = 'rechazado';
      }
    });
  }
}
