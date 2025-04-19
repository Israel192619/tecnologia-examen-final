import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexedDBService } from '../servicios/indexed-db.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mascota-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascota-edit.component.html',
  styleUrl: './mascota-edit.component.css'
})
export class MascotaEditComponent {
  IMAGEN_PREVISUALIZACION:any = 'https://www.ladridosybigotes.com/content/images/2024/10/2024-08-13-animal-hoarding-disorder.webp';
  IMAGEN_FILE:any = null;
  @Input() mascota: any;
  formAdopcion: FormGroup;
  id:any = 0
  nombre:any = ''
  especie:any = ''
  raza:any = ''
  edad:any = 0
  tamano:any = ''
  descripcion:any = ''
  img:any = '';

  constructor(public modal: NgbActiveModal,private fb: FormBuilder,private dbService: IndexedDBService,private toaster: ToastrService) {
    this.formAdopcion = this.fb.group({
      id:[null],
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: [''],
      edad: [null, [Validators.required, Validators.min(0)]],
      tamano: ['', Validators.required],
      descripcion: [''],
      img: ['']
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.id = this.mascota.id;
    this.nombre = this.mascota.nombre;
    this.especie = this.mascota.especie;
    this.raza = this.mascota.raza;
    this.edad = this.mascota.edad;
    this.tamano = this.mascota.tamano;
    this.descripcion = this.mascota.descripcion;
    this.img = this.mascota.img;
    this.IMAGEN_PREVISUALIZACION = this.mascota.img;
    this.formAdopcion.get('id')?.setValue(this.id);
  }



  onSubmit() {
    if (this.formAdopcion.valid) {
      //console.log(this.formAdopcion.value);
      const mascota = this.formAdopcion.value;
      //console.log(mascota);
      this.dbService.editarMascota(mascota);

      alert('Mascota registrada para adopción.');
      this.formAdopcion.reset();
      this.modal.close(mascota);
    }
  }
  processAvatar($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.success("EL ARCHIVO NO ES UNA IMAGEN", "MENSAJE DE VALIDACIÓN");
      return;
    }

    this.IMAGEN_FILE = $event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(this.IMAGEN_FILE);

    reader.onloadend = () => {
      this.IMAGEN_PREVISUALIZACION = reader.result;
      console.log('Imagen cargada:', reader.result);
      this.formAdopcion.patchValue({
        img: reader.result
      });
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      this.toaster.error("Hubo un problema al leer la imagen", "Error");
    };
  }

}
