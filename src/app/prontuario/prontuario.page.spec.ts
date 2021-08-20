import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProntuarioPage } from './prontuario.page';

describe('ProntuarioPage', () => {
  let component: ProntuarioPage;
  let fixture: ComponentFixture<ProntuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProntuarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProntuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
