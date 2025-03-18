import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponentsComponent } from './create-account-components.component';

describe('CreateAccountComponentsComponent', () => {
  let component: CreateAccountComponentsComponent;
  let fixture: ComponentFixture<CreateAccountComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
