import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndexedDBService } from '../../servicios/indexed-db.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';

  constructor(public modal: NgbActiveModal ,private fb: FormBuilder, private dbService: IndexedDBService) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    //if (this.registerForm.invalid) return;

    const nuevoUsuario = {
      nombre: this.registerForm.value.nombre,
      email: this.registerForm.value.correo, // corregido
      password: this.registerForm.value.password,
      telefono: this.registerForm.value.telefono,
      direccion: this.registerForm.value.direccion
    };

    this.dbService.guardarUsuario(nuevoUsuario)
      .then(() => {
        this.successMessage = '¡Registro exitoso!';
        this.registerForm.reset();
        this.submitted = false;
        this.modal.close();
      })
      .catch(err => {
        console.error('Error al registrar usuario', err);
      });
  }

}
