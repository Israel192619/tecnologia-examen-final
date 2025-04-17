import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  nombreDB = 'adopcionDeMascotas'; // Cambié el nombre de la base de datos
  nombreStore = 'sesion'; // Puedes mantener este nombre o cambiarlo si lo deseas

  constructor(private router: Router) {
    this.crearBaseDeDatos();
  }

  // 1. Crear la base de datos en IndexedDB
  crearBaseDeDatos() {
    const request = indexedDB.open(this.nombreDB, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.nombreStore)) {
        db.createObjectStore(this.nombreStore);
      }
    };

    request.onerror = () => {
      console.error('Error al crear la base de datos');
    };
  }

  // 2. Guardar la sesión en sessionStorage y en IndexedDB
  guardarSesion(usuario: any) {
    // Guardamos la bandera de sesión en sessionStorage
    sessionStorage.setItem("usuarioLogueado", "true");
    sessionStorage.setItem("usuarioId", usuario.id.toString());

    // Guardamos los datos completos del usuario en IndexedDB
    const request = indexedDB.open(this.nombreDB, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const tx = db.transaction(this.nombreStore, 'readwrite');
      const store = tx.objectStore(this.nombreStore);
      store.put(usuario, 'usuarioActivo');
    };
  }

  // 3. Obtener los datos del usuario desde IndexedDB
  obtenerSesion(callback: (usuario: any) => void) {
    const request = indexedDB.open(this.nombreDB, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const tx = db.transaction(this.nombreStore, 'readonly');
      const store = tx.objectStore(this.nombreStore);
      const getRequest = store.get('usuarioActivo');

      getRequest.onsuccess = () => {
        callback(getRequest.result);
      };

      getRequest.onerror = () => {
        callback(null);
      };
    };
  }

  // 4. Cerrar sesión y limpiar sessionStorage e IndexedDB
  cerrarSesion() {
    // Limpiamos sessionStorage
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("usuarioId");

    // Limpiamos IndexedDB
    const request = indexedDB.open(this.nombreDB, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const tx = db.transaction(this.nombreStore, 'readwrite');
      const store = tx.objectStore(this.nombreStore);
      store.delete('usuarioActivo');
    };
  }

  // 5. Verificar si el usuario está logueado con sessionStorage
  estaLogueado(): boolean {
    return sessionStorage.getItem("usuarioLogueado") === "true";
  }
}
