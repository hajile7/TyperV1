import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TypingSpaceComponent } from "./components/typing-space/typing-space.component";
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TypingSpaceComponent, LoginComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'typerV1';
}
