import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDeleteComponent } from './solicitud-delete.component';

describe('SolicitudDeleteComponent', () => {
  let component: SolicitudDeleteComponent;
  let fixture: ComponentFixture<SolicitudDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
