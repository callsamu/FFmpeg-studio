import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavExpandableMenuComponent } from './nav-expandable-menu.component';

describe('NavExpandableMenuComponent', () => {
  let component: NavExpandableMenuComponent;
  let fixture: ComponentFixture<NavExpandableMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavExpandableMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavExpandableMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
