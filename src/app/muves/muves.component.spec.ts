import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuvesComponent } from './muves.component';

describe('MuvesComponent', () => {
  let component: MuvesComponent;
  let fixture: ComponentFixture<MuvesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuvesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
