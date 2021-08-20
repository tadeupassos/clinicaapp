import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResumoPage } from './resumo.page';

describe('ResumoPage', () => {
  let component: ResumoPage;
  let fixture: ComponentFixture<ResumoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
