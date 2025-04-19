import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../../servicios/indexed-db.service';

@Component({
  selector: 'app-solicitud-delete',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-delete.component.html',
  styleUrl: './solicitud-delete.component.css'
})
export class SolicitudDeleteComponent {
  @Input() solicitud: any;
  @Output() solicitudEnviada: EventEmitter<any> = new EventEmitter();
  nombreElemento = '';
  id:any = 0;
  animalID:any = 0;
  constructor(public modal: NgbActiveModal,private fb: FormBuilder,private dbService: IndexedDBService) {

  }
  ngOnInit(): void {
    this.nombreElemento = this.solicitud.nombre;
    this.id = this.solicitud.id;
    this.animalID = this.solicitud.animalID;
  }

  eliminar() {
    if(this.solicitud.tipo == 'oferta'){
      this.dbService.eliminarMascotaConAdopciones(this.animalID);
      console.log('hof')
    }else{
      this.dbService.eliminarAdopcion(this.id);
    }
    this.solicitudEnviada.emit(this.id);
    this.modal.close(this.id);
  }
  cancelar(){
    this.modal.close();
  }
}
