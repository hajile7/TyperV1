import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserTestComponent } from '../user-test/user-test.component';
import { UserStatsService } from '../../services/user-stats.service';
import { UserStats } from '../../models/user-stats';
import { KeyStatDTO } from '../../models/key-stat-dto';
import { CommonModule } from '@angular/common';
import { UserBigraphStat } from '../../models/user-bigraph-stat';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserTestComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  constructor(private userService: UserService, private userStatsService: UserStatsService) {}

  letters: string[] = 'abcdefghijklmnopqrstuvwxyz_'.split('');

  imgUrl: any;

  userStats: UserStats = {} as UserStats;

  userKeyStats: KeyStatDTO[] = [];

  userBigraphStats: UserBigraphStat[] = [];

  tempBigraphArr: UserBigraphStat[] = [];

  currBigraph: string = "a";

  ngOnInit() {
    this.imgUrl = this.createImgPath(this.getUser().image.imagePath);
    this.getUserStats();
    this.getUserKeyStats();
    this.getUserBigraphStats();
    
    
     
  }

  ngAfterViewInit() {
    //initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });

    //initialize bigraph popover
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = Array.from(popoverTriggerList).map(popoverTriggerEl => {
      const content = `
      <div id='popoverContent'>
        <span class='popoverSpan'>A </span><span class='popoverSpan'>B </span>
        <span class='popoverSpan'>C </span><span class='popoverSpan'>D </span>
        <span class='popoverSpan'>E </span><span class='popoverSpan'>F </span>
        <span class='popoverSpan'>G </span><span class='popoverSpan'>H </span>
        <span class='popoverSpan'>I </span><span class='popoverSpan'>J </span>
        <span class='popoverSpan'>K </span><span class='popoverSpan'>L </span>
        <span class='popoverSpan'>M </span><span class='popoverSpan'>N </span>
        <span class='popoverSpan'>O </span><span class='popoverSpan'>P </span>
        <span class='popoverSpan'>Q </span><span class='popoverSpan'>R </span>
        <span class='popoverSpan'>S </span><span class='popoverSpan'>T </span>
        <span class='popoverSpan'>U </span><span class='popoverSpan'>V </span>
        <span class='popoverSpan'>W </span><span class='popoverSpan'>X </span>
        <span class='popoverSpan'>Y </span><span class='popoverSpan'>Z </span>
      </div>
    `;

     const popoverInstance = new (window as any).bootstrap.Popover(popoverTriggerEl, {
      html: true,
      content: content
    });

    popoverTriggerEl.addEventListener('shown.bs.popover', () => {
      const popoverElement = document.querySelector('.popover');

      if (popoverElement) {
        popoverElement.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLElement;
          
          if (target && target.classList.contains('popoverSpan')) {
            const selectedLetter = target.innerText.trim().toLowerCase();
            console.log('User clicked on letter:', selectedLetter);
            this.currBigraph = selectedLetter;
            this.getUserBigraphStats();
          }
        });
      }
    });

    return popoverInstance;
  });
  }

  getUser() {
    return this.userService.activeUser;
  }

  createImgPath(path : string){
    return `${this.userService.url}${path}`
  }
  
  getUserStats() {
    this.userStatsService.getUserStats(this.getUser().userId).subscribe((response) => {
      this.userStats = response;
    });
  }

  getUserKeyStats() {
    this.userStatsService.getKeyStats(this.getUser().userId).subscribe((response) => {
      this.userKeyStats = response;
      this.userKeyStats.sort((a, b) => a.key.localeCompare(b.key));
      //change 1 to _ and move it to end of arr for iterating in html (purely aesthetic)
      this.userKeyStats[0].key = "_";
      const el = this.userKeyStats.splice(0, 1)[0];
      this.userKeyStats.splice(this.userKeyStats.length, 0, el);
    });
  }

  getUserBigraphStats() {
    this.userStatsService.getBigraphStats(this.getUser().userId, this.currBigraph).subscribe((response) => {
      this.tempBigraphArr = response;
      this.tempBigraphArr.sort((a,b) => a.bigraph.localeCompare(b.bigraph));
      const str1 = this.currBigraph + "1";
      const str2 = "1" + this.currBigraph;
      const replacements = {
      [str1]: this.currBigraph + "_", 
      [str2]: "_" + this.currBigraph
      };
    
      this.userBigraphStats = this.tempBigraphArr.map(bigraph => {
        return {
          ...bigraph,
          bigraph: replacements[bigraph.bigraph] || bigraph.bigraph
        };
      });

      this.userBigraphStats.sort((a, b) => {
        const aStartsWithCurr = a.bigraph.startsWith(this.currBigraph);
        const bStartsWithCurr = b.bigraph.startsWith(this.currBigraph);
        
        if (aStartsWithCurr && !bStartsWithCurr) return -1;
        if (!aStartsWithCurr && bStartsWithCurr) return 1;
  
        return a.bigraph.localeCompare(b.bigraph);
      });

    });
  }

  convertToTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;

  }

  formatDateString(str: string): string {

    const date = new Date(str);
    
    const twoDigit = (num: number) => num.toString().padStart(2, '0');
    
    const month = twoDigit(date.getMonth() + 1);
    const day = twoDigit(date.getDate());
    const year = date.getFullYear().toString().slice(2);
    
    const hours = twoDigit(date.getHours());
    const minutes = twoDigit(date.getMinutes());
    
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  
    }

}
