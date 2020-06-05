import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SessoesPassadaPage } from './sessoes-passada.page';

describe('SessoesPassadaPage', () => {
  let component: SessoesPassadaPage;
  let fixture: ComponentFixture<SessoesPassadaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessoesPassadaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SessoesPassadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
