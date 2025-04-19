import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaDeleteComponent } from './mascota-delete.component';

describe('MascotaDeleteComponent', () => {
  let component: MascotaDeleteComponent;
  let fixture: ComponentFixture<MascotaDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
