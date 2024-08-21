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
  
  rand: number = -1;

  currChar: string = this.preferences[0];

  prevChar: string = "";

  arrSize: number = this.preferences.length;

  includedKeysPressed: number = 0;

  excludedKeysPressed: number = 0;

  totalKeysPressed: number = 0;

  correctKeys: number = 0;

  correct: boolean = false;

  accuracy: string = "0.00%";

  test: string = "test";

  @ViewChild('textInput') textInput!: ElementRef;

  //use AfterViewInit because DOM elements may not be available for manipulation with ngOnInit
  ngAfterViewInit() {
    this.textInput.nativeElement.focus();
  }

  getRandomInt():number {
    return this.rand = Math.floor(Math.random() * (this.arrSize));
  }

  getFirstCharacter() {
    this.currChar = this.testArr[0];
  } 

  getNextChar() {
    this.prevChar = this.currChar;
    this.currChar = this.testArr[this.includedKeysPressed];
    if(this.includedKeysPressed == this.testArr.length) {
      this.startNewInstance();
    }
  }

  startNewInstance() {
    this.includedKeysPressed = 0;
    this.excludedKeysPressed = 0;
    this.totalKeysPressed = 0;
    this.correctKeys = 0;
    this.accuracy = "0.00%";
    this.correctStatus = [];
    this.testArr = this.shuffleArray(this.testArr);
    this.currChar = this.testArr[0];
    //use timeout to ensure character before reset is also cleared from input
    setTimeout(() => {
      this.textInput.nativeElement.value = "";
    }, 0);
  }

  onInput(event: any) {
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
    this.getNextChar();

  }

  calcAccuracy(): string {
    this.totalKeysPressed = this.includedKeysPressed + this.excludedKeysPressed;
    return this.accuracy = ((Number.parseFloat((this.correctKeys/this.totalKeysPressed).toFixed(4))) * 100).toFixed(2) + "%";
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
