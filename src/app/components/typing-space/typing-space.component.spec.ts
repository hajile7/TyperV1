import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingSpaceComponent } from './typing-space.component';

describe('TypingSpaceComponent', () => {
  let component: TypingSpaceComponent;
  let fixture: ComponentFixture<TypingSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
