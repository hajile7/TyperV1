import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-word-typing-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-typing-space.component.html',
  styleUrl: './word-typing-space.component.css'
})
export class WordTypingSpaceComponent {

  //Word arrays

  letters: string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  words: string[] = ["cow", "cat", "dog", "snake", "horse", "bird", "pig", "rat"];

  testArr: string[] = this.convertToCharArr(this.shuffleArray(this.words));

  //Time

  startTime: number = 0;

  currentTime: number = 0;

  elapsedTime: number = 0;

  //Accuracy

  accuracy: string = "0.00%";

  totalAccuracy: number = 0;

  accuracyArr: number[] = [];

  //Speed

  speed: string = "000.00cpm";

  totalSpeed: number = 0;

  speedArr: number[] = [];

  placeholderSpeed: string = "000.00cpm";

  //Correct Status

  correctStatus: boolean[] = [];

  correct: boolean = false;

  //Key Counters
  
  excludedKeysPressed: number = 0;

  includedKeysPressed: number = 0;

  correctSpaces: number = 0;

  correctKeys: number = 0;

  //Others

  currIndex: number = 0;

  currChar: string = this.testArr[0];

  prevChar: string = "";

  @ViewChild('textInput') textInput?: ElementRef;

  //Functions

  ngAfterViewInit() {
    this.textInput?.nativeElement.focus();
  }

  onInput(event: any) {
    const lastTypedChar: string = event.key;

    if(!this.letters.includes(lastTypedChar) && !(lastTypedChar == "Backspace" || lastTypedChar == "Shift" || lastTypedChar == " ")) {
      this.excludedKeysPressed++;
    }

    if(this.letters.includes(lastTypedChar) || lastTypedChar == " ") {
      this.includedKeysPressed++;
      if (this.currIndex < this.testArr.length - 1) {
        this.currIndex++;
      }
      if (this.currChar == '1' && lastTypedChar == " ") {
        this.correct = true;
        this.correctSpaces++;
        this.correctKeys++;
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

    // this.calcAccuracy();
    // this.calcSpeed();
       this.getNextChar();

  }

  getNextChar() {
    this.prevChar = this.currChar;
    this.currChar = this.testArr[this.includedKeysPressed];
    if(this.includedKeysPressed == this.testArr.length - 1) {
      this.startNewInstance();
    }
  }

  startNewInstance() {
    // this.calcTotalAccuracy();
    // this.calcTotalSpeed();
    this.includedKeysPressed = 0;
    this.excludedKeysPressed = 0;
    // this.totalKeysPressed = 0;
    this.correctKeys = 0;
    this.accuracy = "00.00%";
    this.correctStatus = [];
    this.testArr = this.convertToCharArr(this.shuffleArray(this.words));
    this.currChar = this.testArr[0];
    this.startTime = 0;
    this.elapsedTime = 0;
    this.speed = "000.00cpm"
    this.currIndex = 0;
  }

  convertToCharArr(words: string[]): string[] {
    let result: string[] = [];
    words.forEach(word => {
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
