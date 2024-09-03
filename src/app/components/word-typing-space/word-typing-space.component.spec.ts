import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTypingSpaceComponent } from './word-typing-space.component';

describe('WordTypingSpaceComponent', () => {
  let component: WordTypingSpaceComponent;
  let fixture: ComponentFixture<WordTypingSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordTypingSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordTypingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
