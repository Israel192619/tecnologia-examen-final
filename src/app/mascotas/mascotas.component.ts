import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { IndexedDBService } from '../servicios/indexed-db.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudCrearComponent } from '../adopciones/solicitud-crear/solicitud-crear.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascotas.component.html',
  styleUrl: './mascotas.component.css'
})
export class MascotasComponent {
  formAdopcion: FormGroup;
  IMAGEN_PREVISUALIZACION:any = 'https://www.ladridosybigotes.com/content/images/2024/10/2024-08-13-animal-hoarding-disorder.webp';
  IMAGEN_FILE:any = null;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //console.log('IMAGEN_PREVISUALIZACION:', this.IMAGEN_PREVISUALIZACION);
  }

  constructor(public modal: NgbActiveModal,private fb: FormBuilder,private dbService: IndexedDBService,private modalService: NgbModal,private toaster: ToastrService) {
    this.formAdopcion = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: [''],
      edad: [null, [Validators.required, Validators.min(0)]],
      tamano: ['', Validators.required],
      descripcion: [''],
      img: ['']
    });
  }

  onSubmit() {
    if (this.formAdopcion.valid) {
      const mascota = this.formAdopcion.value;
      this.dbService.guardarMascota(mascota)
        .then(id => {
          //console.log('Este es el id de la mascota:', id);
          const idUsuario = Number(sessionStorage.getItem('usuarioId'));
          return this.dbService.miUsuario(idUsuario).then(usuario => ({ id, usuario }));
        })
        .then(({ id, usuario }) => {
          console.log('Usuario encontrado:', usuario);
          const modalRef = this.modalService.open(SolicitudCrearComponent, { backdrop: 'static',
            keyboard: false });
          modalRef.componentInstance.animalId = id;
          modalRef.componentInstance.usuario = usuario;
          modalRef.componentInstance.tipoOferta = 'oferta';

        })
        .catch(error => {
          console.error('Error al guardar la mascota o recuperar el usuario:', error);
        });
      //alert('Mascota registrada para adopción.');
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
