import { TestBed } from '@angular/core/testing';

import { AddtaskService } from './addtask.service';

describe('AddtaskService', () => {
  let service: AddtaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddtaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
