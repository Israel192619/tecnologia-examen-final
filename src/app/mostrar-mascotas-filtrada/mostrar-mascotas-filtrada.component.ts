import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../servicios/indexed-db.service';

@Component({
  selector: 'app-mostrar-mascotas-filtrada',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mostrar-mascotas-filtrada.component.html',
  styleUrl: './mostrar-mascotas-filtrada.component.css'
})
export class MostrarMascotasFiltradaComponent {
  IMAGEN_PREVISUALIZACION:any = 'https://www.ladridosybigotes.com/content/images/2024/10/2024-08-13-animal-hoarding-disorder.webp';
  @Input() categoria: any;
  @Output() mascotaEnviada: EventEmitter<any> = new EventEmitter();
/*   @Output() mascotaEnviada = new EventEmitter<string>(); */
  listaMascotasFiltradas: any[] = [];
  id:any = 0
  nombre:any = ''
  especie:any = ''
  raza:any = ''
  edad:any = 0
  tamano:any = ''
  descripcion:any = ''
  constructor(public indexdb: IndexedDBService ,public modal: NgbActiveModal,private fb: FormBuilder,private dbService: IndexedDBService){

  }
  ngOnInit(): void {
    this.obtenerMascotas();
  }
  mensajeSinMascotas = false;
 obtenerMascotas() {
  this.indexdb.obtenerMascotasPorEspecie(this.categoria).then(mascotas => {
    this.listaMascotasFiltradas = mascotas;
    this.mensajeSinMascotas = mascotas.length === 0;
  }).catch(error => {
    console.error('Error al obtener mascotas:', error);
  });
}
  mostrarMascota(mascota:any){
    this.mascotaEnviada.emit(mascota);
    this.modal.close();
  }
}
