import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { StatsBarComponent } from '../stats-bar/stats-bar.component';

@Component({
  selector: 'app-word-typing-space',
  standalone: true,
  imports: [CommonModule, StatsBarComponent],
  templateUrl: './word-typing-space.component.html',
  styleUrl: './word-typing-space.component.css'
})
export class WordTypingSpaceComponent {

  constructor(private renderer: Renderer2){}

  //Word arrays

  letters: string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  tempWords: string[] = ["cow", "cat", "dog", "snake", "horse", "bird", "pig", "rat", "cow", "cat", "dog", "snake", "horse", "bird", "pig", "rat", "horse", "bird", "pig", "rat",
    "horse", "bird", "pig", "rat", "horse", "pig", "rat", "horse", "thick", "create"
  ];

  testArr: string[] = this.convertToCharArr(this.shuffleArray(this.tempWords));

  words: { chars: string[]; startIndex: number }[] = [];

  //Time

  startTime: number = 0;

  currentTime: number = 0;

  elapsedTime: number = 0;

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

  private keyListener: (() => void) | null = null;

  @ViewChild('textInput') textInput?: ElementRef;

  //Functions

  ngOnInit() {
    this.convertCharstoWords();
  }

  ngAfterViewInit(): void {
    this.textInput?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.removeGlobalKeyListener();
  }

  onBlur(): void {
    this.isFocused = false;
    this.addGlobalKeyListener();
  }

  onFocus(): void {
    this.isFocused = true;
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

  onInput(event: any): void {

    if(!this.startTime) {
      this.startTime = Date.now();
      this.updateTimer();
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
    this.speed = (avgWord/this.elapsedTime) * 60;
  }

  calcTotalSpeed(): void {
    let total: number = 0;
    this.speedArr.forEach(num => {
      total += num;
    })
    this.totalSpeed = total/this.speedArr.length;
  }

  startNewInstance(): void {
    this.calcTotalAccuracy();
    this.calcTotalSpeed();
    this.words = [];
    this.includedKeysPressed = 0;
    this.excludedKeysPressed = 0;
    this.totalKeysPressed = 0;
    this.correctKeys = 0;
    this.spaces = 0;
    this.correctStatus = [];
    this.accuracy = 0;
    this.testArr = this.convertToCharArr(this.shuffleArray(this.tempWords));
    this.convertCharstoWords();
    this.currChar = this.testArr[0];
    this.startTime = 0;
    this.elapsedTime = 0;
    this.speed = 0;
    this.currIndex = 0;
  }

  updateTimer(): void {
    this.currentTime = Date.now();
    this.elapsedTime = Math.floor((this.currentTime - this.startTime) / 1000);
    setTimeout(() => {
      this.updateTimer();
    }, 1000);
  }

  convertCharstoWords(): void {
    let currentWordChars: string[] = [];
    let startIndex = 0;

    for (let i = 0; i < this.testArr.length; i++) {
      const char = this.testArr[i];

      if (char === '1') {
        // When '1' is encountered, it denotes a space between words
        if (currentWordChars.length > 0) {
          this.words.push({ chars: currentWordChars, startIndex });
          currentWordChars = [];
        }
        startIndex = i + 1; // Update startIndex for the next word
      } else {
        if (currentWordChars.length === 0) {
          startIndex = i; // Set startIndex at the beginning of a new word
        }
        currentWordChars.push(char);
      }
    }

    // Add the last word if there is one
    if (currentWordChars.length > 0) {
      this.words.push({ chars: currentWordChars, startIndex });
    }
  }

  convertToCharArr(tempWords: string[]): string[] {
    let result: string[] = [];
    tempWords.forEach(word => {
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
