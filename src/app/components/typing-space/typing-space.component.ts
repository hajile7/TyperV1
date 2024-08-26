import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, } from '@angular/core';

@Component({
  selector: 'app-typing-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing-space.component.html',
  styleUrl: './typing-space.component.css'
})
export class TypingSpaceComponent {

  letters: string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  numbers: string[] = ['0','1', '2', '3', '4', '5','6','7','8','9']

  symbols: string[] = [']', '[', '(',')','{','}','|','&','^','~','`','@','#','$','%',',','.','!','?',';',':','\'','\"','\\','/','-','+','*','=','<','>']

  words: string[] = ['cat', 'dog', 'horse', 'cow', 'pig']

  correctStatus: boolean[] = [];

  preferences: string[] = this.letters;

  testArr: string[] = this.shuffleArray(this.preferences);
  
  currChar: string = this.preferences[0];

  prevChar: string = "";

  arrSize: number = this.preferences.length;

  includedKeysPressed: number = 0;

  excludedKeysPressed: number = 0;

  totalKeysPressed: number = 0;

  correctKeys: number = 0;

  correct: boolean = false;

  accuracy: string = "0.00%";

  totalAccuracy: number = 0;

  accuracyArr: number[] = [];

  startTime: number = 0;

  currentTime: number = 0;

  elapsedTime: number = 0;

  speed: string = "000.00cpm";

  totalSpeed: number = 0;

  speedArr: number[] = [];

  placeholderSpeed: string = "000.00cpm";

  test: number = 0;


  @ViewChild('textInput') textInput!: ElementRef;

  //use AfterViewInit because DOM elements may not be available for manipulation with ngOnInit
  ngAfterViewInit() {
    this.textInput.nativeElement.focus();
  }

  getFirstCharacter() {
    this.currChar = this.testArr[0];
  } 

  getNextChar() {
    this.prevChar = this.currChar;
    this.currChar = this.testArr[this.includedKeysPressed];
    if(this.includedKeysPressed == this.testArr.length) {
      this.speedArr.push((this.testArr.length/this.elapsedTime) * 60);
      this.accuracyArr.push(Number.parseFloat((this.correctKeys/this.totalKeysPressed).toFixed(4)) * 100);
      this.startNewInstance();
    }
  }

  startNewInstance() {
    this.calcTotalAccuracy();
    this.calcTotalSpeed();
    this.includedKeysPressed = 0;
    this.excludedKeysPressed = 0;
    this.totalKeysPressed = 0;
    this.correctKeys = 0;
    this.accuracy = "00.00%";
    this.correctStatus = [];
    this.testArr = this.shuffleArray(this.testArr);
    this.currChar = this.testArr[0];
    this.startTime = 0;
    this.elapsedTime = 0;
    this.speed = "000.00cpm"
    //use timeout to ensure character before reset is also cleared from input
    setTimeout(() => {
      this.textInput.nativeElement.value = "";
    }, 0);
  }

  onInput(event: any) {
    if(!this.startTime) {
      this.startTime = Date.now();
      this.updateTimer();
    }
    const lastTypedChar: string = event.key;
    if(!this.testArr.includes(lastTypedChar) && !(lastTypedChar == "Backspace" || lastTypedChar == " " || lastTypedChar == "Shift")) {
      this.excludedKeysPressed++;
    }
    if(this.testArr.includes(lastTypedChar)) {
      this.includedKeysPressed++;
      if (this.currChar == lastTypedChar) {
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
  
  calcAccuracy(): string {
    this.totalKeysPressed = this.includedKeysPressed + this.excludedKeysPressed;
    return this.accuracy = ((Number.parseFloat((this.correctKeys/this.totalKeysPressed).toFixed(4))) * 100).toFixed(2) + "%";
  }

  calcTotalAccuracy(): number {
    let total: number = 0
    this.accuracyArr.forEach(num => {
      total += num;
    })
    return this.totalAccuracy = total/this.accuracyArr.length;
  }

  calcSpeed(): string {
    if (this.elapsedTime === 0) {
      return "N/A";
    }
    return this.speed = ((this.testArr.length/this.elapsedTime) * 60).toFixed(2) + "cpm";
  }

  calcTotalSpeed(): number {
    let total: number = 0;
    this.speedArr.forEach(num => {
      total += num;
    })
    return this.totalSpeed = total/this.speedArr.length;
  }

  updateTimer(): void {
    this.currentTime = Date.now();
    this.elapsedTime = Math.floor((this.currentTime - this.startTime) / 1000);
    setTimeout(() => {
      this.updateTimer();
    }, 1000);
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
