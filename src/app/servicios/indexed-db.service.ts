import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  dbNombre = 'adopcionDeMascotas';
  private db!: IDBDatabase;
  private objetoUsuario = 'usuarios';
  private objetoMascotas = 'mascotas';
  private objetoAdopciones = 'adopciones';

  constructor(private toaster: ToastrService) {
    this.initDB();
  }

  initDB() {
    const request = indexedDB.open(this.dbNombre, 6);
    request.onsuccess = () => {
      this.db = request.result;
      console.log("Base de datos abierta", this.db);
    }

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;

      if (!this.db.objectStoreNames.contains(this.objetoUsuario)) {
        const usuarioStore = this.db.createObjectStore(this.objetoUsuario, { keyPath: 'id', autoIncrement: true });
      }
      if (!this.db.objectStoreNames.contains(this.objetoMascotas)) {
        this.db.createObjectStore(this.objetoMascotas, { keyPath: 'id', autoIncrement: true });
      }
      if (!this.db.objectStoreNames.contains(this.objetoAdopciones)) {
        this.db.createObjectStore(this.objetoAdopciones, { keyPath: 'id', autoIncrement: true });
      }
      if (this.db.objectStoreNames.contains('sesion')) {
        this.db.deleteObjectStore('sesion');
        console.log('Tabla "sesion" eliminada correctamente');
      }
    }

    request.onerror = (error) => {
      console.log('Error al abrir la DB', error);
    }
  }

  guardarUsuario(usuario: { nombre: string; email: string; password: string; telefono: number; direccion: string }): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoUsuario], 'readwrite');
      const objetoUsuario = trs.objectStore(this.objetoUsuario);
      objetoUsuario.add(usuario);
      this.toaster.success('Usuario registrado correctamente','USUARIO')

      trs.oncomplete = () => satisfactorio();
      trs.onerror = () => rechazo(trs.error);
    });
  }
 /*  guardarMascota(mascota: { nombre: string; especie: string; raza: string , edad: number, tamano:string, descripcion:string}): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoMascotas], 'readwrite');
      const objetoMascotas = trs.objectStore(this.objetoMascotas);
      objetoMascotas.add(mascota);

      trs.oncomplete = () => satisfactorio();
      trs.onerror = () => rechazo(trs.error);
    });
  } */
  guardarMascota(mascota: { nombre: string; especie: string; raza: string, edad: number, tamano: string, descripcion: string, img:string}): Promise<IDBValidKey> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoMascotas], 'readwrite');
      const objetoMascotas = trs.objectStore(this.objetoMascotas);
      const request = objetoMascotas.add(mascota);

      request.onsuccess = () => satisfactorio(request.result); // devuelve el ID generado
      request.onerror = () => rechazo(request.error);
    });
  }

  guardarAdopcion(solicitud: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    motivo: string;
    estado: string;
    parentId: number;
    animalID: number;
    usuarioId: number;
    tipo: 'solicitud' | 'oferta';
  }): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
      const trsLectura = this.db.transaction([this.objetoAdopciones], 'readonly');
      const storeLectura = trsLectura.objectStore(this.objetoAdopciones);

      const request = storeLectura.getAll();
      //console.log(solicitud.animalID,'idanimal')
      request.onsuccess = () => {
        const adopciones = request.result;
        const ofertaRelacionada = adopciones.find((a: any) =>
          a.animalID == solicitud.animalID && a.tipo == 'oferta'
        );
        if (ofertaRelacionada) {
          //console.log(ofertaRelacionada,'siuu');
          solicitud.parentId = ofertaRelacionada.id;
        }

        solicitud.estado = 'pendiente';

        const trsEscritura = this.db.transaction([this.objetoAdopciones], 'readwrite');
        const storeEscritura = trsEscritura.objectStore(this.objetoAdopciones);
        storeEscritura.add(solicitud);

        this.toaster.success('Procesado correctamente', 'ADOPCIÓN');

        trsEscritura.oncomplete = () => satisfactorio();
        trsEscritura.onerror = () => rechazo(trsEscritura.error);
      };

      request.onerror = () => {
        rechazo(request.error);
      };
    });
  }

  eliminarAdopcion(id: number): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoAdopciones], 'readwrite');
      const objetoAdopciones = trs.objectStore(this.objetoAdopciones);

      const solicitudEliminar = objetoAdopciones.delete(id);

      solicitudEliminar.onsuccess = () => {
        this.toaster.success('Solicitud eliminada correctamente', 'ADOPCIÓN');
        satisfactorio();
      };

      solicitudEliminar.onerror = () => {
        this.toaster.error('Error al eliminar la solicitud', 'ADOPCIÓN');
        rechazo(solicitudEliminar.error);
      };
    });
  }

  guardarAdopcionEditada(solicitud: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    motivo: string;
    estado: string;
    parentId: number;
    animalId: number;
    usuarioId: number;
    tipo: 'solicitud' | 'oferta';
}): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
        const trs = this.db.transaction([this.objetoAdopciones], 'readwrite');
        const objetoAdopciones = trs.objectStore(this.objetoAdopciones);

        objetoAdopciones.put(solicitud);

        this.toaster.success('Solicitud actualizada correctamente', 'ADOPCIÓN');

        trs.oncomplete = () => satisfactorio();
        trs.onerror = () => rechazo(trs.error);
    });
}
guardarEstadoAdopcion(solicitud: {
  id: number;
  estado: string;
}): Promise<void> {
  return new Promise((satisfactorio, rechazo) => {
    // Iniciar la transacción en modo 'readonly' para obtener la solicitud
    const trsLectura = this.db.transaction([this.objetoAdopciones], 'readonly');
    const storeLectura = trsLectura.objectStore(this.objetoAdopciones);

    const request = storeLectura.getAll(); // Obtener todas las adopciones

    request.onsuccess = () => {
      const adopciones = request.result;
      const adopcion = adopciones.find((a: any) => a.id === solicitud.id);

      if (adopcion) {
        // Solo cambiar el estado de la solicitud encontrada
        adopcion.estado = solicitud.estado;

        // Iniciar la transacción en modo 'readwrite' para actualizar
        const trsEscritura = this.db.transaction([this.objetoAdopciones], 'readwrite');
        const storeEscritura = trsEscritura.objectStore(this.objetoAdopciones);

        storeEscritura.put(adopcion); // Actualizamos el estado

        trsEscritura.oncomplete = () => {
          this.toaster.success('Estado actualizado correctamente', 'ADOPCIÓN');
          satisfactorio();
        };

        trsEscritura.onerror = () => {
          rechazo(trsEscritura.error);
        };
      } else {
        rechazo('Solicitud no encontrada');
      }
    };

    request.onerror = () => {
      rechazo(request.error);
    };
  });
}


  obtenerSolicitudesConMascotas(): Promise<any[]> {
    return new Promise((satisfactorio, rechazo) => {
      const solicitudes: any[] = [];

      const trsSolicitudes = this.db.transaction([this.objetoAdopciones], 'readonly');
      const storeSolicitudes = trsSolicitudes.objectStore(this.objetoAdopciones);
      const requestSolicitudes = storeSolicitudes.getAll();

      requestSolicitudes.onsuccess = () => {

        const resultados = requestSolicitudes.result.filter(s => s.tipo === 'solicitud');

        if (!resultados.length) return satisfactorio([]);

        const trsMascotas = this.db.transaction([this.objetoMascotas], 'readonly');
        const storeMascotas = trsMascotas.objectStore(this.objetoMascotas);

        let pendientes = resultados.length;

        resultados.forEach(solicitud => {
          const id = solicitud.animalID;

          if (typeof id === 'number' && !isNaN(id)) {
            const mascotaReq = storeMascotas.get(id);

            mascotaReq.onsuccess = () => {
              const mascota = mascotaReq.result;
              solicitudes.push({ ...solicitud, mascota });
              if (--pendientes === 0) satisfactorio(solicitudes);
            };

            mascotaReq.onerror = () => {
              solicitudes.push({ ...solicitud, mascota: null });
              if (--pendientes === 0) satisfactorio(solicitudes);
            };
          } else {
            solicitudes.push({ ...solicitud, mascota: null });
            if (--pendientes === 0) satisfactorio(solicitudes);
          }
        });
      };

      requestSolicitudes.onerror = () => {
        rechazo(requestSolicitudes.error);
      };
    });
  }




  editarMascota(mascota: { id: number, nombre: string; especie: string; raza: string, edad: number, tamano: string, descripcion: string }): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoMascotas], 'readwrite');
      const objetoMascotas = trs.objectStore(this.objetoMascotas);
      this.toaster.success('Se editó correctamente','EDITAR')

      const solicitud = objetoMascotas.put(mascota); // `put` actualiza si ya existe por id

      solicitud.onsuccess = () => satisfactorio();
      solicitud.onerror = () => rechazo(solicitud.error);
    });
  }

  eliminarMascotaConAdopciones(id: number): Promise<void> {
  return new Promise((satisfactorio, rechazo) => {
    const trs = this.db.transaction([this.objetoMascotas, this.objetoAdopciones], 'readwrite');
    const mascotasStore = trs.objectStore(this.objetoMascotas);
    const adopcionesStore = trs.objectStore(this.objetoAdopciones);

    const cursorRequest = adopcionesStore.openCursor();
    const eliminaciones: Promise<void>[] = [];

    cursorRequest.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        const adopcion = cursor.value;
        if (adopcion.animalID === id) {
          const deletePromise = new Promise<void>((res, rej) => {
            const req = adopcionesStore.delete(cursor.key);
            req.onsuccess = () => {
              console.log(`Adopción con id ${cursor.key} eliminada`);
              res();
            };
            req.onerror = () => {
              console.error("Error eliminando adopción", req.error);
              rej(req.error);
            };
          });
          eliminaciones.push(deletePromise);
        }
        cursor.continue();
      } else {
        // Cuando se termina de recorrer todo
        Promise.all(eliminaciones)
          .then(() => {
            const deleteMascotaRequest = mascotasStore.delete(id);
            deleteMascotaRequest.onsuccess = () => {
              this.toaster.success('Se eliminó correctamente', 'ELIMINAR');
              satisfactorio();
            };
            deleteMascotaRequest.onerror = () => {
              console.error("Error eliminando mascota", deleteMascotaRequest.error);
              rechazo(deleteMascotaRequest.error);
            };
          })
          .catch(error => {
            console.error("Error en la eliminación de adopciones:", error);
            rechazo(error);
          });
      }
    };

    cursorRequest.onerror = () => {
      console.error("Error al buscar adopciones relacionadas", cursorRequest.error);
      rechazo(cursorRequest.error);
    };

    trs.onerror = () => {
      console.error("Error al eliminar la transacción", trs.error);
      rechazo(trs.error);
    };
  });
}


  cerrarSesion() {
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("usuarioId");
  }

  estaLogueado(): boolean {
    return sessionStorage.getItem("usuarioLogueado") === "true";
  }

  loginUsuario(email: string, password: string): Observable<{ success: boolean; usuario?: any; mensaje: string }> {
    return new Observable((observer) => {
      const trans = this.db.transaction([this.objetoUsuario], 'readonly');
      const store = trans.objectStore(this.objetoUsuario);
      const request = store.openCursor();

      let encontrado = false;

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;

        if (cursor) {
          const usuario = cursor.value;
          if (usuario.email === email) {
            encontrado = true;
            if (usuario.password === password) {
              // Guardamos en sessionStorage
              sessionStorage.setItem("usuarioLogueado", "true");
              sessionStorage.setItem("usuarioId", usuario.id.toString());
              this.toaster.success("Usuario Ingresó Correctamente","Autenticación");
              observer.next({ success: true, usuario, mensaje: 'Inicio de sesión exitoso' });
            } else {
              observer.next({ success: false, mensaje: 'Contraseña incorrecta' });
              this.toaster.error("Contraseña incorrecta","Autenticación");
            }
            observer.complete();
          } else {
            cursor.continue();
          }
        } else {
          if (!encontrado) {
            observer.next({ success: false, mensaje: 'Usuario no encontrado' });
            this.toaster.error("Usuario no encontrado","Autenticación");
            observer.complete();
          }
        }
      };

      request.onerror = () => {
        observer.error({ success: false, mensaje: 'Error al buscar usuario', error: request.error });
      };
    });
  }

  obtenerMascotas(): Promise<any[]> {
    return new Promise((satisfactorio, rechazo) => {
      const mascotasConUsuario: any[] = [];

      const trsAdopciones = this.db.transaction([this.objetoAdopciones], 'readonly');
      const storeAdopciones = trsAdopciones.objectStore(this.objetoAdopciones);
      const requestAdopciones = storeAdopciones.getAll();

      requestAdopciones.onsuccess = () => {
        const ofertas = requestAdopciones.result.filter((a: any) => a.tipo === 'oferta');

        if (!ofertas.length) return satisfactorio([]); // No hay ofertas

        const idsMascotas = ofertas.map(o => o.animalID).filter(id => typeof id === 'number');
        const trsMascotas = this.db.transaction([this.objetoMascotas], 'readonly');
        const storeMascotas = trsMascotas.objectStore(this.objetoMascotas);

        let pendientes = idsMascotas.length;

        idsMascotas.forEach((id, index) => {
          const oferta = ofertas.find(o => o.animalID === id);
          const req = storeMascotas.get(id);

          req.onsuccess = () => {
            if (req.result) {
              mascotasConUsuario.push({
                mascota: req.result,
                usuarioID: oferta?.usuarioID ?? null
              });
            }
            if (--pendientes === 0) satisfactorio(mascotasConUsuario);
          };

          req.onerror = () => {
            if (--pendientes === 0) satisfactorio(mascotasConUsuario);
          };
        });
      };

      requestAdopciones.onerror = () => {
        this.toaster.error('Error al obtener las adopciones', 'ADOPCIÓN');
        rechazo(requestAdopciones.error);
      };
    });
  }


  obtenerMascotasPorEspecie(especie: string): Promise<any[]> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoMascotas], 'readonly');
      const objetoMascotas = trs.objectStore(this.objetoMascotas);
      const mascotas: any[] = [];

      const cursor = objetoMascotas.openCursor();

      cursor.onsuccess = () => {
        const puntero = cursor.result;
        if (puntero) {
          if (puntero.value.especie === especie) {
            mascotas.push(puntero.value);
          }
          puntero.continue();
        } else {
          satisfactorio(mascotas);
        }
      };

      cursor.onerror = () => {
        rechazo('Error al filtrar mascotas por especie');
      };
    });
  }


  miUsuario(id: number): Promise<any> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoUsuario], 'readonly');
      const objetoUsuario = trs.objectStore(this.objetoUsuario);

      const solicitud = objetoUsuario.get(id);

      solicitud.onsuccess = () => {
        const usuario = solicitud.result;
        if (usuario) {
          satisfactorio(usuario);
        } else {
          rechazo(new Error('Usuario no encontrado'));
        }
      };

      solicitud.onerror = () => rechazo(solicitud.error);
    });
  }

  editarUsuario(usuario: { id: number; nombre: string; email: string; password: string }): Promise<void> {
    return new Promise((satisfactorio, rechazo) => {
      const trs = this.db.transaction([this.objetoUsuario], 'readwrite');
      const objetoUsuario = trs.objectStore(this.objetoUsuario);
      this.toaster.success('Se edió correctamente','EDITAR')

      const solicitud = objetoUsuario.put(usuario); // put actualiza si el id ya existe

      solicitud.onsuccess = () => satisfactorio();
      solicitud.onerror = () => rechazo(solicitud.error);
    });
  }


}
