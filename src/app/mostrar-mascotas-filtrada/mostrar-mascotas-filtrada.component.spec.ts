import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarMascotasFiltradaComponent } from './mostrar-mascotas-filtrada.component';

describe('MostrarMascotasFiltradaComponent', () => {
  let component: MostrarMascotasFiltradaComponent;
  let fixture: ComponentFixture<MostrarMascotasFiltradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarMascotasFiltradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarMascotasFiltradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
