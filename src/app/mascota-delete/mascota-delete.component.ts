import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../servicios/indexed-db.service';

@Component({
  selector: 'app-mascota-delete',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascota-delete.component.html',
  styleUrl: './mascota-delete.component.css'
})
export class MascotaDeleteComponent {
  @Input() mascota: any;
  nombreElemento = '';
  id:any = 0;
  constructor(public modal: NgbActiveModal,private fb: FormBuilder,private dbService: IndexedDBService) {

  }
  ngOnInit(): void {
    this.nombreElemento = this.mascota.nombre;
    this.id = this.mascota.id;
  }

  eliminar() {
    this.dbService.eliminarMascotaConAdopciones(this.id);
    this.modal.close(this.id);
  }
  cancelar(){
    this.modal.close();
  }
}
