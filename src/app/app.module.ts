import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NbThemeModule, NbLayoutModule, NbSearchModule, NbCardModule, NbButtonModule,NbListModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './components/404/page-not-found.component';
import {HttpClientModule} from "@angular/common/http";
import { SearchComponent } from './search/feature/search.component';
import { SongItemComponent } from './search/ui/song-item.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SearchComponent,
    SongItemComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NbThemeModule.forRoot({name: 'default'}),
        NbLayoutModule,
        NbEvaIconsModule,
        AppRoutingModule,
        NbSearchModule,
        NbCardModule,
        NbButtonModule,
        HttpClientModule,
        NbListModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
