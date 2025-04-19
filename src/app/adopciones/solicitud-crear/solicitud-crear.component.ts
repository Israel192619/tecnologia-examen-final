import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndexedDBService } from '../../servicios/indexed-db.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-solicitud-crear',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-crear.component.html',
  styleUrl: './solicitud-crear.component.css'
})
export class SolicitudCrearComponent {
  @Input() usuario: any;
  @Input() animalId: any;
  @Input() tipoOferta: string = ''
  animalID:any = 0
  usuarioID:any = 0
  nombre:any = ''
  email:any = ''
  telefono:any = 0
  direccion:any = ''
  tipo:any = ''

  solicitudForm!: FormGroup;
  submitted = false;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder, public idb: IndexedDBService) {}

  ngOnInit(): void {
    console.log(this.usuario);
    this.solicitudForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      motivo: [''],
      animalID: [null, Validators.required],
      usuarioID: [null, Validators.required],
      tipo: [''],
    });
    this.nombre = this.usuario.nombre;
    this.email = this.usuario.email;
    this.usuarioID = this.usuario.id;
    this.telefono = this.usuario.telefono;
    this.direccion = this.usuario.direccion;
    this.tipo = this.tipoOferta;
    if (this.animalId) {
      this.animalID = this.animalId;
    }
    //this.solicitudForm.get('id')?.setValue(this.usuarioID);
  }

  enviarSolicitud(): void {
    this.submitted = true;

    if (this.solicitudForm.invalid) {
      return;
    }

    const solicitud = this.solicitudForm.value;
    console.log('Solicitud enviada:', solicitud);
    this.idb.guardarAdopcion(solicitud);
    this.solicitudForm.reset();
    this.submitted = false;
    this.modal.close();
  }
}
