import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPacientePage } from './add-paciente.page';

describe('AddPacientePage', () => {
  let component: AddPacientePage;
  let fixture: ComponentFixture<AddPacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPacientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
