import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCrearComponent } from './solicitud-crear.component';

describe('SolicitudCrearComponent', () => {
  let component: SolicitudCrearComponent;
  let fixture: ComponentFixture<SolicitudCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
