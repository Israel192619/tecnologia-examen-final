import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudShowComponent } from './solicitud-show.component';

describe('SolicitudShowComponent', () => {
  let component: SolicitudShowComponent;
  let fixture: ComponentFixture<SolicitudShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
