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

    //initialize popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = Array.from(popoverTriggerList).map(popoverTriggerEl => new (window as any).bootstrap.Popover(popoverTriggerEl));

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
      //change 1 to Space and move it to end of arr for iterating in html (purely aesthetic)
      this.userKeyStats[0].key = "_";
      const el = this.userKeyStats.splice(0, 1)[0];
      this.userKeyStats.splice(this.userKeyStats.length, 0, el);
    });
  }

  getUserBigraphStats() {
    this.userStatsService.getBigraphStats(this.getUser().userId, this.currBigraph).subscribe((response) => {
      this.userBigraphStats = response;
      this.userBigraphStats.sort((a,b) => a.bigraph.localeCompare(b.bigraph))
      //change 1 to Space and move it to end of arr for iterating in html (purely aesthetic)
      this.userBigraphStats[0].bigraph = "_" + this.currBigraph;
      const el = this.userBigraphStats.splice(0, 1)[0];
      this.userBigraphStats.splice(this.userBigraphStats.length, 0, el);
      this.userBigraphStats[0].bigraph = this.currBigraph + "_";
      console.log(this.userBigraphStats);
    });
  }



  
}


