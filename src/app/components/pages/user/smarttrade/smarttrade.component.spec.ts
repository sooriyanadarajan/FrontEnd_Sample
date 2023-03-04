import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmarttradeComponent } from './smarttrade.component';

describe('SmarttradeComponent', () => {
  let component: SmarttradeComponent;
  let fixture: ComponentFixture<SmarttradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmarttradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmarttradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
