import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserTestComponent } from '../user-test/user-test.component';
import { UserStatsService } from '../../services/user-stats.service';
import { UserStats } from '../../models/user-stats';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserTestComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  constructor(private userService: UserService, private userStatsService: UserStatsService) {}

  imgUrl: any;

  userStats: UserStats = {} as UserStats;

  ngOnInit() {
    this.imgUrl = this.createImgPath(this.getUser().image.imagePath)
    this.getUserStats();
  }

  getUser() {
    return this.userService.activeUser;
  }

  getUserStats() {
    this.userStatsService.getUserStats(this.getUser().userId).subscribe((response) => {
      this.userStats = response;
      console.log(this.userStats)
    });
  }

  createImgPath(path : string){
    return `${this.userService.url}${path}`
  }


}
