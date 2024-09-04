import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-typing-space',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginComponent],
  templateUrl: './typing-space.component.html',
  styleUrl: './typing-space.component.css'
})
export class TypingSpaceComponent {

  //Character Arrays

  letters: string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  numbers: string[] = ['0','1', '2', '3', '4', '5','6','7','8','9']

  symbols: string[] = [']', '[', '(',')','{','}','|','&','^','~','`','@','#','$','%',',','.','!','?',';',':','\'','\"','\\','/','-','+','*','=','<','>']

  preferences: string[] = this.letters.concat(this.letters);

  testArr: string[] = this.shuffleArray(this.preferences);

  //Time

  startTime: number = 0;

  currentTime: number = 0;

  elapsedTime: number = 0;

  //Accuracy

  accuracy: number = 0;

  prevAccuracy: number = 0

  totalAccuracy: number = 0;

  accuracyArr: number[] = [];

  //Speed

  placeholderSpeed: string = "000.00 cpm";

  speed: number = 0;

  prevSpeed: number = 0;

  totalSpeed: number = 0;

  speedArr: number[] = [];


  //Correct Status

  correctStatus: boolean[] = [];

  correct: boolean = false;

  //Key Counters

  includedKeysPressed: number = 0;

  excludedKeysPressed: number = 0;

  totalKeysPressed: number = 0;

  correctKeys: number = 0;

  //Others
  
  currIndex: number = 0;

  currChar: string = this.preferences[0];

  prevChar: string = "";

  arrSize: number = this.preferences.length;

  roundCount: number = 0;

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
      this.speedArr.push(this.speed);
      this.accuracyArr.push(this.accuracy);
      this.prevAccuracy = this.accuracy;
      this.prevSpeed = this.speed;
      this.roundCount++;
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
    this.accuracy = 0;
    this.correctStatus = [];
    this.testArr = this.shuffleArray(this.testArr);
    this.currChar = this.testArr[0];
    this.startTime = 0;
    this.elapsedTime = 0;
    this.speed = 0;
    this.currIndex = 0;
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
      if (this.currIndex < this.testArr.length - 1) {
        this.currIndex++;
      }
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
  
  calcAccuracy() {
    this.totalKeysPressed = this.includedKeysPressed + this.excludedKeysPressed;
    this.accuracy = this.correctKeys/this.totalKeysPressed;
  }

  calcTotalAccuracy() {
    let total: number = 0
    this.accuracyArr.forEach(num => {
      total += num;
    })
    this.totalAccuracy = total/this.accuracyArr.length;
  }

  calcSpeed() {
    this.speed = (this.testArr.length/this.elapsedTime) * 60;
  }

  calcTotalSpeed() {
    let total: number = 0;
    this.speedArr.forEach(num => {
      total += num;
    })
    this.totalSpeed = total/this.speedArr.length;
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
