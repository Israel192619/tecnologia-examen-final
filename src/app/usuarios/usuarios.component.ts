import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndexedDBService } from '../servicios/indexed-db.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  @Input() usuario: any;
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  id:any = 0
  nombre:any = ''
  email:any = ''
  password:any = ''
  telefono:any = ''
  direccion:any = ''

  constructor(public modal: NgbActiveModal,private fb: FormBuilder, private dbService: IndexedDBService) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.id = this.usuario.id;
    this.nombre = this.usuario.nombre;
    this.email = this.usuario.email;
    this.telefono = this.usuario.telefono;
    this.direccion = this.usuario.direccion;
    this.registerForm.get('id')?.setValue(this.id);
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    //if (this.registerForm.invalid) return;
    const passwordFinal = this.registerForm.value.password
    ? this.registerForm.value.password
    : this.usuario.password;
    const esteUsuario = {
      id: this.id,
      nombre: this.registerForm.value.nombre,
      email: this.registerForm.value.email,
      password: passwordFinal,
      telefono: this.registerForm.value.telefono,
      direccion: this.registerForm.value.direccion
    };

    this.dbService.editarUsuario(esteUsuario)
    .then(() => {
      this.successMessage = '¡Usuario actualizado exitosamente!';
      this.registerForm.reset();
      this.submitted = false;
      this.modal.close();
    })
    .catch((err:any) => {
      console.error('Error al actualizar usuario', err);
    });

    }
}
