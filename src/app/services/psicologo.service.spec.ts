import { TestBed } from '@angular/core/testing';

import { PsicologoService } from './psicologo.service';

describe('PsicologoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsicologoService = TestBed.get(PsicologoService);
    expect(service).toBeTruthy();
  });
});
