import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesDropdownComponent } from './routes-dropdown.component';

describe('RoutesDropdownComponent', () => {
  let component: RoutesDropdownComponent;
  let fixture: ComponentFixture<RoutesDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
