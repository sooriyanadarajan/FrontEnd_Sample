import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotsignalComponent } from './botsignal.component';

describe('BotsignalComponent', () => {
  let component: BotsignalComponent;
  let fixture: ComponentFixture<BotsignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotsignalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotsignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
