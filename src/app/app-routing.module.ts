import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashPage } from './splash/splash.page';
import { LoginPage } from './login/login.page';
import { CreateUserPage } from './create-user/create-user.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    component: SplashPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'create-user',
    component: CreateUserPage
  },
  {
    path: 'tabs',

    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }