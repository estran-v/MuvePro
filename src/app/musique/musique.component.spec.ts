import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiqueComponent } from './musique.component';

describe('MusiqueComponent', () => {
  let component: MusiqueComponent;
  let fixture: ComponentFixture<MusiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
