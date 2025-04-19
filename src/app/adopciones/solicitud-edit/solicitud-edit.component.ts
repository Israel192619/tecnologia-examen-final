import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../../servicios/indexed-db.service';

@Component({
  selector: 'app-solicitud-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-edit.component.html',
  styleUrl: './solicitud-edit.component.css'
})
export class SolicitudEditComponent {
  @Input() solicitud: any;
  @Input() animalId: any;
  @Input() tipoOferta: string = ''
  @Output() solicitudEnviada: EventEmitter<any> = new EventEmitter();
  animalID:any = 0
  usuarioID:any = 0
  nombre:any = ''
  email:any = ''
  telefono:any = 0
  direccion:any = ''
  tipo:any = ''
  motivo:any = ''
  id:any = 0;
  estado:any = '';

  solicitudForm!: FormGroup;
  submitted = false;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder, public idb: IndexedDBService) {}

  ngOnInit(): void {
    console.log(this.solicitud);
    this.solicitudForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      motivo: [''],
      animalID: [null, Validators.required],
      usuarioID: [null, Validators.required],
      tipo: [''],
      estado: [''],
      id:[null]
    });
    this.nombre = this.solicitud.nombre;
    this.email = this.solicitud.email;
    this.animalID = this.solicitud.animalID;
    this.usuarioID = this.solicitud.usuarioID;
    this.telefono = this.solicitud.telefono;
    this.direccion = this.solicitud.direccion;
    this.tipo = this.solicitud.tipo;
    this.id = this.solicitud.id;
    this.motivo = this.solicitud.motivo;
    this.estado = this.solicitud.estado;
    this.solicitudForm.get('id')?.setValue(this.id);
    console.log(this.estado);
    /* if (this.animalId) {
      this.animalID = this.animalId;
    } */
    //this.solicitudForm.get('id')?.setValue(this.usuarioID);
  }

  enviarSolicitud(): void {
    this.submitted = true;

    if (this.solicitudForm.invalid) {
      return;
    }

    const solicitud = this.solicitudForm.value;
    console.log('Solicitud enviada:', solicitud);
    this.idb.guardarAdopcionEditada(solicitud);
    this.solicitudEnviada.emit(solicitud);
    this.solicitudForm.reset();
    this.submitted = false;
    this.modal.close();
  }
}
