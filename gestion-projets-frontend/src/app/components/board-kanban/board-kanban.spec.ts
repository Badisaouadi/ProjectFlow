import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardKanban } from './board-kanban';

describe('BoardKanban', () => {
  let component: BoardKanban;
  let fixture: ComponentFixture<BoardKanban>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardKanban],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardKanban);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
