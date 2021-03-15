import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DxTreeListModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxTreeListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
