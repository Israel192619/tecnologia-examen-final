import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Solo importa NgbActiveModal
import { RegisterComponent } from '../register/register.component';
import { IndexedDBService } from '../../servicios/indexed-db.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // No es necesario importar NgbModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder, private modalService: NgbModal, private dbService: IndexedDBService, private toaster: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      /* console.log('Login:', email, password);
      this.modal.close(); // Cierra el modal */
      this.dbService.loginUsuario(email, password).subscribe((response) => {
        console.log(response);
        console.log('Loguin exitoso');
        //this.toaster.success("Usuario Ingresó Correctamente","Autenticación");
        this.modal.close();
        }, (error:any) => {
          this.toaster.success(error,"Autenticación");
          console.error(error);
          });
    }
  }
  registrarse(){
    this.modal.close();
    this.modalService.open(RegisterComponent);
  }

}
