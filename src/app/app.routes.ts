import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WordTypingSpaceComponent } from './components/word-typing-space/word-typing-space.component';
import { TypingSpaceComponent } from './components/typing-space/typing-space.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    {path: "Home/Words", component: WordTypingSpaceComponent},
    {path: "Home/Characters", component: TypingSpaceComponent},
    {path: "Login", component: LoginComponent},
    {path: "Settings", component: PreferencesComponent},
    {path: "Profile", component: ProfileComponent},
    {path: "**", redirectTo: "Home/Words", pathMatch: "full"}
];
