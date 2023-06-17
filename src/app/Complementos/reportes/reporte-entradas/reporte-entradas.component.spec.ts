import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEntradasComponent } from './reporte-entradas.component';

describe('ReporteEntradasComponent', () => {
  let component: ReporteEntradasComponent;
  let fixture: ComponentFixture<ReporteEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEntradasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
