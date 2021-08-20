import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSessaoPage } from './add-sessao.page';

describe('AddSessaoPage', () => {
  let component: AddSessaoPage;
  let fixture: ComponentFixture<AddSessaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSessaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSessaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
