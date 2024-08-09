import { Component } from '@angular/core';

@Component({
  selector: 'app-typing-space',
  standalone: true,
  imports: [],
  templateUrl: './typing-space.component.html',
  styleUrl: './typing-space.component.css'
})
export class TypingSpaceComponent {

  letters:string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  numbers:string[] = ['0','1', '2', '3', '4', '5','6','7','8','9']

  symbols:string[] = [']', '[', '(',')','{','}','|','&','^','~','`','@','#','$','%',',','.','!','?',';',':','\'','\"','\\','/','-','+','*','=','<','>']

  preferences:string[] = this.letters;
  
  rand:number = Math.floor(Math.random() * 25);

  currChar:string = this.preferences[0];

  prevChar:string = "";

  arrSize:number = this.preferences.length;

  keysPressed:number = 0;

  correctKeys:number = 0;

  correct:boolean = false;

  accuracy:number = 0;

  getRandomInt():number {
    return this.rand = Math.floor(Math.random() * (this.arrSize));
  }

  getRandomCharacter() {
    this.currChar = this.preferences[this.rand]
  } 

  getNextChar() {
    this.prevChar = this.currChar;
    this.getRandomInt();
    this.getRandomCharacter();
  }

  onInput(event: any) {
    const lastTypedChar: string = event.target.value.slice(-1);
    if(this.preferences.includes(lastTypedChar)) {
      this.keysPressed++;
      if (this.currChar == lastTypedChar) {
        this.correct = true;
        this.correctKeys++;
      }
      else {
        this.correct = false;
      }
      this.accuracy = Number.parseFloat((this.correctKeys/this.keysPressed).toFixed(2));
      this.getNextChar();
    }
  }
}
