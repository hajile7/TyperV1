import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WordTypingSpaceComponent } from './components/word-typing-space/word-typing-space.component';

export const routes: Routes = [
    {path: "Home", component: WordTypingSpaceComponent},
    {path: "Login", component: LoginComponent},
    {path: "**", redirectTo: "Home", pathMatch: "full"}
];
