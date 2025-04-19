import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../../servicios/indexed-db.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud-show',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './solicitud-show.component.html',
  styleUrl: './solicitud-show.component.css'
})
export class SolicitudShowComponent {
  @Input() solicitud: any;
  animalID:any = 0
  usuarioID:any = 0
  nombre:any = ''
  email:any = ''
  telefono:any = 0
  direccion:any = ''
  tipo:any = ''
  nombreMascota:any = ''
  especie:any = ''
  motivo:any = ''
  submitted = false;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder, public idb: IndexedDBService) {}

  ngOnInit(): void {
    console.log(this.solicitud);
    this.nombre = this.solicitud.nombre;
    this.email = this.solicitud.email;
    this.usuarioID = this.solicitud.id;
    this.telefono = this.solicitud.telefono;
    this.direccion = this.solicitud.direccion;
    this.tipo = this.solicitud.tipo;
    this.motivo = this.solicitud.motivo;
    this.nombreMascota = this.solicitud.mascota.nombre;
    this.especie = this.solicitud.mascota.especie;
    console.log(this.solicitud);
    //this.solicitudForm.get('id')?.setValue(this.usuarioID);
  }
  cerrar(){
    this.modal.close();
  }
}
