import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { StatsBarComponent } from '../stats-bar/stats-bar.component';
import { WordService } from '../../services/word.service';
import { UserService } from '../../services/user.service';
import { UserTypingTestDTO } from '../../models/user-typing-test-dto';
import { UserStatsService } from '../../services/user-stats.service';
import { UserBigraphStatDTO } from '../../models/user-bigraph-stat-dto';
import { KeyStatDTO } from '../../models/key-stat-dto';
import { UserStatsDTO } from '../../models/user-stats-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-typing-space',
  standalone: true,
  imports: [CommonModule, StatsBarComponent],
  templateUrl: './word-typing-space.component.html',
  styleUrl: './word-typing-space.component.css'
})
export class WordTypingSpaceComponent {

  constructor(private renderer: Renderer2, private wordService: WordService,
    private userService: UserService, private userStatsService: UserStatsService,
    private router: Router){}

  //Word arrays

  letters: string[] = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h','i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's','t','u','v','w','x','y','z']; 

  preprocessedWords: string[] = [];

  testArr: string[] = [];

  words: { chars: string[]; startIndex: number }[] = [];

  charsTypedArr: { char: string; time: number; correct: boolean; charPushed: string }[] = []; 

  bigraphsDataArr: { bigraph: string; speed: number; incorrectCount: number; correctCount: number }[] = [];
  
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

  correctKeys: number = 0;

  //User, Key, and Test Stats

  currDate: any;

  previousTest: UserTypingTestDTO = {} as UserTypingTestDTO;

  bigraphsStats: UserBigraphStatDTO[] = [];

  keyStats: KeyStatDTO[] = [];

  userStats: UserStatsDTO = {} as UserStatsDTO;

  //Others

  currIndex: number = 0;

  currChar: string = this.testArr[0];

  prevChar: string = "";

  roundCount: number = 0;

  isFocused: boolean = true;

  timerId: any;

  pauseTime: number = 0;

  activeSession: boolean = false;

  userLetter: string = "";

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
    // this.login();
  }

  // login() {
  //   this.userService.login("dev", "dev").subscribe((response) => {
  //     this.userService.activeUser = response;
  //     this.userService.isLoggedIn = true;
  //     this.router.navigate(["/Home"]);
  //   })
  // }

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
      this.currDate = new Date().toISOString();
      this.activeSession = true;
    }

    const lastTypedChar: string = event.key;
    this.userLetter = lastTypedChar;

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

    this.calcAccuracy();
    this.calcSpeed();
    this.getNextChar();
    
  }

  getNextChar(): void {
    if(this.letters.includes(this.userLetter) || this.userLetter == " ") {
      this.charsTypedArr.push({char: this.currChar, time: this.accurateTime, correct: this.correct, charPushed: this.userLetter});
    }
    this.prevChar = this.currChar;
    this.currChar = this.testArr[this.includedKeysPressed];
    if(this.includedKeysPressed == this.testArr.length - 1) {
      if(this.userService.isLoggedIn) {
        if (!this.previousTest) {
          this.previousTest = {} as UserTypingTestDTO;
        }
        this.previousTest.userId = this.userService.activeUser.userId;
        this.previousTest.charCount = this.testArr.length;
        this.previousTest.incorrectCount = this.charsTypedArr.filter(c => c.correct == false).length;
        this.previousTest.mode = "words"; 
        this.previousTest.speed = this.speed; 
        this.previousTest.accuracy = this.accuracy * 100;
        this.previousTest.date = new Date().toISOString();
      }
      this.accuracyArr.push(this.accuracy);
      this.speedArr.push(this.speed);
      this.prevAccuracy = this.accuracy;
      this.prevSpeed = this.speed;
      this.roundCount++;
      this.startNewInstance();
    }
  }

  startNewInstance(): void {
    this.generateUserBigraphStatDTO();   
    this.generateKeyStats();            
    this.generateUserStats();
    
    // to send to backend
    if (this.userService.isLoggedIn) {
      this.userStatsService.addTest(this.previousTest).subscribe({
        next: (response) => { 
          console.log("Test successfully posted", response);
          this.resetPreviousTest(); 
        },
        error: (error) => {
          console.error("Error posting test", error);
          this.resetPreviousTest();
        }
      });
  
      this.userStatsService.postBigraphStats(this.bigraphsStats).subscribe({
        next: (response) => {
          console.log("Bigraph stats posted", response);
          this.resetBigraphsStats();
        },
        error: (error) => {
          console.error("Error posting bigraphs", error);
          this.resetBigraphsStats(); 
        }
      });
  
      this.userStatsService.postKeyStats(this.keyStats).subscribe({
        next: (response) => { 
          console.log("Key stats posted", response);
          this.resetKeyStats(); 
        },
        error: (error) => {
          console.error("Error posting keys", error);
          this.resetKeyStats();
        }
      });
  
      this.userStatsService.postStats(this.userStats).subscribe({
        next: (response) => { 
          console.log("Stats successfully posted", response);
          this.resetUserStats(); 
        },
        error: (error) => {
          console.error("Error posting stats", error);
          this.resetUserStats();
        }
      });
    }
  
    this.calcTotalAccuracy();
    this.calcTotalSpeed();      
    this.charsTypedArr = [];
    this.bigraphsDataArr = [];
    this.words = [];
    this.correctStatus = [];
    this.preprocessedWords = [];
    this.activeSession = false;
    this.includedKeysPressed = 0;
    this.excludedKeysPressed = 0;
    this.totalKeysPressed = 0;
    this.correctKeys = 0;
    this.accuracy = 0;
    
    this.wordService.getRandomWordArr().subscribe(data => {
      this.preprocessedWords = data;
      this.testArr = this.convertToCharArr(this.shuffleArray(this.preprocessedWords));
      this.convertCharstoWords();
      this.currChar = this.testArr[0];
    });
  
    this.startTime = 0;
    this.elapsedTime = 0;
    this.accurateTime = 0;
    this.speed = 0;
    this.currIndex = 0;
  
    this.pauseTimer();
  }

  resetPreviousTest(): void {
    this.previousTest = {} as UserTypingTestDTO;
  }
  
  resetBigraphsStats(): void {
    this.bigraphsStats = [];
  }
  
  resetKeyStats(): void {
    this.keyStats = [];
  }
  
  resetUserStats(): void {
    this.userStats = {} as UserStatsDTO;
  }

  //Calculation Functions

  calcAccuracy(): void {
    this.totalKeysPressed = this.includedKeysPressed + this.excludedKeysPressed;
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
    const currTime = performance.now();
    const elapsedTimeMins = (currTime - this.startTime) / 1000 / 60;
    this.speed = (this.totalKeysPressed / 4.7) / elapsedTimeMins;
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

  //Array creation and manipulation

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

  generateUserBigraphStatDTO() {
    if(this.charsTypedArr.length >= 2) {
      for(let i = this.charsTypedArr.length - 1; i >= 1; i--) {
        let incorrectCount: number = 0;
        let correctCount: number = 0;
        let newBigraph: string = this.charsTypedArr[i - 1].char + this.charsTypedArr[i].char;
        if(this.charsTypedArr[i - 1].correct == false || this.charsTypedArr[i].correct == false) {
          incorrectCount++;
        }
        else {
          correctCount++;
        }
        this.bigraphsDataArr.push({bigraph: newBigraph, speed: (this.charsTypedArr[i].time) - (this.charsTypedArr[i - 1].time), incorrectCount: incorrectCount, correctCount: correctCount});
        incorrectCount = 0;
        correctCount = 0;
      }
      this.bigraphsDataArr.forEach((bigraph) => {
        //If is first instance of bigraph
        if((this.bigraphsStats.filter(s => s.bigraph == bigraph.bigraph).length == 0) || this.bigraphsStats.length == 0) {
          this.bigraphsStats.push({userId: this.userService.activeUser.userId, 
            bigraph: bigraph.bigraph, speed: bigraph.speed, corrCount: bigraph.correctCount, 
            accuracy: bigraph.correctCount * 100, quantity: 1})
        }
        //If is second+ instance of bigraph
        else {
          let index: number = this.bigraphsStats.findIndex(s => s.bigraph == bigraph.bigraph);

          if(index >= 0) {
            this.bigraphsStats[index].quantity++;
            if(bigraph.correctCount == 1) {
              this.bigraphsStats[index].corrCount++;
            }
            this.bigraphsStats[index].speed =  (this.bigraphsStats[index].speed + bigraph.speed) / this.bigraphsStats[index].quantity;
            this.bigraphsStats[index].accuracy = ((this.bigraphsStats[index].corrCount) / this.bigraphsStats[index].quantity) * 100;
          }
        }
      })
    }
  }

  generateKeyStats() {
    const frequencyMap = this.charsTypedArr.reduce((acc, current) => {
      const char = current.char;
      if (!acc[char]) {
        acc[char] = { char: char, frequency: 0, correctCount: 0, totalSpeed: 0, bigraphCount: 0 };
      }
    
      acc[char].frequency++;
      if (current.correct) {
        acc[char].correctCount++;
      }
    
      this.bigraphsDataArr.forEach(bigraphData => {
        if (bigraphData.bigraph[1] === char) {
          acc[char].totalSpeed += bigraphData.speed;
          acc[char].bigraphCount++;
        }
      });
    
      return acc;
    }, {} as { [key: string]: { char: string; frequency: number; correctCount: number; totalSpeed: number; bigraphCount: number } });
    
    const frequencyArr = Object.values(frequencyMap).map(charData => ({
      char: charData.char,
      frequency: charData.frequency,
      accuracy: (charData.correctCount / charData.frequency) * 100, 
      speed: charData.bigraphCount > 0 ? charData.totalSpeed / charData.bigraphCount : 0
    }));

    frequencyArr.forEach(k => {
      this.keyStats.push({ userId: this.userService.activeUser.userId, key: k.char, totalTyped: k.frequency, accuracy: k.accuracy, speed: k.speed });
    });
  }

  generateUserStats() {
    this.userStats.userId = this.userService.activeUser.userId;
    this.userStats.charsTyped = this.charsTypedArr.length;
    this.userStats.timeTyped = Math.floor(this.accurateTime); //Have to use Math.floor for now
    this.userStats.accuracy = this.prevAccuracy * 100;
    this.userStats.WPM = this.prevSpeed;
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
