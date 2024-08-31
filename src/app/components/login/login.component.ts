import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private userService: UserService, private router: Router){}

  firstName: string = "";
  lastName: string = "";
  email: string = "";
  username: string = "";
  registerUsername: string = "";
  password: string = "";
  registerPassword: string = "";
  confirmPassword: string = "";

  fileName: string = "";
  imgUrl: any;
  newUserForm: FormData = new FormData();

  registerUser() {
    this.newUserForm.append("FirstName", this.firstName);
    this.newUserForm.append("LastName", this.lastName);
    this.newUserForm.append("UserName", this.registerUsername);
    this.newUserForm.append("Password", this.registerPassword);
    this.newUserForm.append("email", this.email);

    this.userService.addUser(this.newUserForm).subscribe((response) => {
      this.fileName = "";
      this.firstName = "";
      this.lastName = "";
      this.username = "";
      this.newUserForm = new FormData();
      this.router.navigate(["/Home"])
    })

  }
  
  onFileSelect(event: any) {
    const file: File = event.target.files[0];

    if(file) {
      this.fileName = file.name;

      this.newUserForm.append("Image", file);
      this.newUserForm.append("filename", file.name);

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgUrl = reader.result;
      }
    }
  }

  login() {
    this.userService.login(this.username, this.password).subscribe((response) => {
      this.userService.activeUser = response;
      this.userService.isLoggedIn = true;
      this.username = "";
      this.password = "";
      this.router.navigate(["/Home"]);
    })
  }


  logout() {
    this.userService.activeUser = {} as UserModel;
    this.userService.isLoggedIn = false;
    this.router.navigate(["/Home"]);
  }

  activeUser() {
    return this.userService.activeUser;
  }

  isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  createImgPath(path: string): string {
    return `${this.userService.url}${path}`;
  }

}
