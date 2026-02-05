import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountComponent } from './components/account/account.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { Home } from './components/home/home.component';
import { History } from './components/history/history.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: Home },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent }, // Dashboard
  { path: 'transfer', component: TransferComponent },
  { path: 'history', component: History },
    { path: 'settings', component: SettingsComponent }
];
