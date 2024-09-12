import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { StatsBarComponent } from '../stats-bar/stats-bar.component';
import { WordService } from '../../services/word.service';

@Component({
  selector: 'app-word-typing-space',
  standalone: true,
  imports: [CommonModule, StatsBarComponent],
  templateUrl: './word-typing-space.component.html',
  styleUrl: './word-typing-space.component.css'
})
export class WordTypingSpaceComponent {

  constructor(private renderer: Renderer2, private wordService: WordService, private cdr: ChangeDetectorRef){}

  //Word arrays

  letters: string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  preprocessedWords: string[] = [];

  testArr: string[] = [];

  words: { chars: string[]; startIndex: number }[] = [];

  //Time

  startTime: number = 0;

  currentTime: number = 0;

  elapsedTime: number = 0;

  accurateTime: number = 0;

  //Accuracy

  accuracy: number = 0;

  totalAccuracy: number = 0;

  accuracyArr: number[] = [];

  prevAccuracy: number = 0;

  //Speed

  placeholderSpeed: string = "000.00 wpm";

  speed: number = 0;

  totalSpeed: number = 0;

  speedArr: number[] = [];

  prevSpeed: number = 0;

  //Correct Status

  correctStatus: boolean[] = [];

  correct: boolean = false;

  //Key Counters

  totalKeysPressed: number = 0;
  
  excludedKeysPressed: number = 0;

  includedKeysPressed: number = 0;

  spaces: number = 0;

  correctKeys: number = 0;

  //Others

  currIndex: number = 0;

  currChar: string = this.testArr[0];

  prevChar: string = "";

  roundCount: number = 0;

  isFocused: boolean = true;

  timerId: any;

  pauseTime: number = 0;

  activeSession: boolean = false;

  private keyListener: (() => void) | null = null;

  @ViewChild('textInput') textInput?: ElementRef;

  //Functions

  //Lifecycle Functions

  ngOnInit() {
    this.wordService.getRandomWordArr().subscribe(data => {
      this.preprocessedWords = data;
      this.testArr = this.convertToCharArr(this.shuffleArray(this.preprocessedWords));
      this.currChar = this.testArr[0];
      this.convertCharstoWords();
    }); 
  }

  ngAfterViewInit(): void {
    this.textInput?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.removeGlobalKeyListener();
  }

  //Focus/blur functions

  onBlur(): void {
    this.pauseTimer();
    this.isFocused = false;
    this.addGlobalKeyListener();
  }

  onFocus(): void {
    this.isFocused = true;
    if(this.activeSession) {
      this.resumeTimer();
    }
    this.removeGlobalKeyListener();
  }

  addGlobalKeyListener(): void {
    if(!this.keyListener) {
      this.keyListener = this.renderer.listen('window', 'keyup', (event: KeyboardEvent) => {
        this.textInput?.nativeElement.focus();
      });
    }
  }

  removeGlobalKeyListener() {
    if (this.keyListener) {
      this.keyListener(); //unsubscribe the listener via .listen
    }
      this.keyListener = null;
  }

  //Handling input + current test state

  onInput(event: any): void {
    this.startTimer();

    if(!this.activeSession) {
      this.activeSession = true;
    }

    const lastTypedChar: string = event.key;

    if(!this.letters.includes(lastTypedChar) && !(lastTypedChar == "Backspace" || lastTypedChar == "Shift" || lastTypedChar == " ")) {
      this.excludedKeysPressed++;
    }

    if(lastTypedChar == " ") {
      this.spaces++;
    }

    if(this.letters.includes(lastTypedChar) || lastTypedChar == " ") {
      this.includedKeysPressed++;
      if (this.currIndex < this.testArr.length - 1) {
        this.currIndex++;
      }
      if (this.currChar == '1' && lastTypedChar == " ") {
        this.correct = true;
        this.correctStatus.push(true);
      }
      else if (this.currChar == lastTypedChar) {
        this.correct = true;
        this.correctKeys++;
        this.correctStatus.push(true);
      }
      else {
        this.correct = false;
        this.correctStatus.push(false);
      }
    }

    this.calcAccuracy();
    this.calcSpeed();
    this.getNextChar();
  }

  getNextChar(): void {
    this.prevChar = this.currChar;
    this.currChar = this.testArr[this.includedKeysPressed];
    if(this.includedKeysPressed == this.testArr.length - 1) {
      this.accuracyArr.push(this.accuracy);
      this.speedArr.push(this.speed);
      this.prevAccuracy = this.accuracy;
      this.prevSpeed = this.speed;
      this.roundCount++;
      this.startNewInstance();
    }
  }

  startNewInstance(): void {
    this.calcTotalAccuracy();
    this.calcTotalSpeed();
    this.activeSession = false;
    this.words = [];
    this.includedKeysPressed = 0;
    this.excludedKeysPressed = 0;
    this.totalKeysPressed = 0;
    this.correctKeys = 0;
    this.spaces = 0;
    this.correctStatus = [];
    this.accuracy = 0;
    this.wordService.getRandomWordArr().subscribe(data => {
      this.preprocessedWords = data;
    });
    this.testArr = this.convertToCharArr(this.shuffleArray(this.preprocessedWords));
    this.convertCharstoWords();
    this.currChar = this.testArr[0];
    this.startTime = 0;
    this.elapsedTime = 0;
    this.accurateTime = 0;
    this.speed = 0;
    this.currIndex = 0;
    this.pauseTimer();
  }

  //Calculation Functions

  calcAccuracy(): void {
    this.totalKeysPressed = (this.includedKeysPressed + this.excludedKeysPressed) - this.spaces;
    this.accuracy = this.correctKeys/this.totalKeysPressed;
  }

  calcTotalAccuracy(): void {
    let total: number = 0;
    this.accuracyArr.forEach(num => {
      total += num;
    })
    this.totalAccuracy = total/this.accuracyArr.length;
  }

  calcSpeed(): void {
    let avgWord: number = (this.testArr.length - this.testArr.filter(x => x == "1").length)/4.7;
    this.speed = (avgWord/this.accurateTime) * 60;
  }

  calcTotalSpeed(): void {
    let total: number = 0;
    this.speedArr.forEach(num => {
      total += num;
    })
    this.totalSpeed = total/this.speedArr.length;
  }

  //Timer Functions

  startTimer(): void {
    if(!this.startTime) {
      this.startTime = performance.now();
      this.updateTimer();
    }
  }

  updateTimer(): void {
    this.currentTime = performance.now();
    this.accurateTime = (this.currentTime - this.startTime) / 1000;
    this.elapsedTime = Math.floor((this.currentTime - this.startTime) / 1000);
    this.timerId = requestAnimationFrame(() => this.updateTimer());
  }

  pauseTimer(): void {
    if (this.timerId) {
      cancelAnimationFrame(this.timerId);
      this.timerId = null;
    }
  }

  resumeTimer(): void {
   if (!this.timerId) {
     this.startTime = performance.now() - (this.elapsedTime * 1000);
     this.updateTimer();
   } 
  }

  //Array manipulations

  convertCharstoWords(): void {
    let currentWordChars: string[] = [];
    let startIndex = 0;

    for (let i = 0; i < this.testArr.length; i++) {
      const char = this.testArr[i];

      if (char === '1') {
        if (currentWordChars.length > 0) {
          this.words.push({ chars: currentWordChars, startIndex });
          currentWordChars = [];
        }
        startIndex = i + 1; 
      } else {
        if (currentWordChars.length === 0) {
          startIndex = i; 
        }
        currentWordChars.push(char);
      }
    }

    if (currentWordChars.length > 0) {
      this.words.push({ chars: currentWordChars, startIndex });
    }
  }

  convertToCharArr(preprocessedWords: string[]): string[] {
    let result: string[] = [];
    preprocessedWords.forEach(word => {
      result = result.concat(word.split(''));
      result.push("1")
    });
    return result;
  }

  shuffleArray(arr: string[]): string[] {
    let currIndex: number = arr.length;
    while(currIndex != 0) {
      let randIndex: number = Math.floor(Math.random() * currIndex);
      currIndex--;
      [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
    }
    return arr;
  }

}
