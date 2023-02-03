import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from "./components/404/page-not-found.component";
import { SearchComponent } from './search/feature/search.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
