import { Routes } from '@angular/router';
import { TypingSpaceComponent } from './components/typing-space/typing-space.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path: "Home", component: TypingSpaceComponent},
    {path: "Login", component: LoginComponent},
    {path: "**", redirectTo: "Home", pathMatch: "full"}
];
