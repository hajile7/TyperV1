import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private userService: UserService){}

  isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  getUsername() {
    return this.userService.activeUser.userName;
  }

  logout() {
    this.userService.logout();
  }

}
