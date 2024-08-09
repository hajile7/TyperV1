import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TypingSpaceComponent } from "./components/typing-space/typing-space.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TypingSpaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'typerV1';
}
