import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaShowComponent } from './mascota-show.component';

describe('MascotaShowComponent', () => {
  let component: MascotaShowComponent;
  let fixture: ComponentFixture<MascotaShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
