import { Component } from '@angular/core';
import { UserStatsService } from '../../services/user-stats.service';
import { UserTypingTestDTO } from '../../models/user-typing-test-dto';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-test.component.html',
  styleUrl: './user-test.component.css'
})
export class UserTestComponent {

  constructor(private userStatService: UserStatsService, private userService: UserService) {}

  testList: UserTypingTestDTO[] = [];

  ngOnInit() {
    this.userStatService.getPreviousTests(this.userService.activeUser.userId)
      .subscribe((tests: UserTypingTestDTO[]) => {
        this.testList = tests
        this.testList.forEach(t => {
          t.date = this.formatDateString(t.date!);
        });
      });
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
