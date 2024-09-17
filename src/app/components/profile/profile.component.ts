import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserTestComponent } from '../user-test/user-test.component';
import { UserStatsService } from '../../services/user-stats.service';
import { UserStats } from '../../models/user-stats';
import { KeyStatDTO } from '../../models/key-stat-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserTestComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  constructor(private userService: UserService, private userStatsService: UserStatsService) {}

  imgUrl: any;

  userStats: UserStats = {} as UserStats;

  userKeyStats: KeyStatDTO[] = [];

  ngOnInit() {
    this.imgUrl = this.createImgPath(this.getUser().image.imagePath)
    this.getUserStats();
    this.getUserKeyStats();
  }

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
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
      //change 1 to Space and move it to end of arr for iterating in html
      this.userKeyStats[0].key = "Space";
      const el = this.userKeyStats.splice(0, 1)[0];
      this.userKeyStats.splice(this.userKeyStats.length, 0, el);
    });
  }

}
