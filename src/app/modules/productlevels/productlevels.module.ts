import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { ProductLevelsComponent } from './productlevels.component';
import { ProductLevelListComponent } from './productlevel-list/productlevel-list.component';
import { MaterialModule } from 'src/app/material.module';
import { AddProductLevelComponent } from './add-productlevel/add-productlevel.component';
import { RemoveProductLevelComponent } from './remove-productlevel/remove-productlevel.component';

const routes: Routes = [
  {
    path: 'productlevels',
    component: ProductLevelsComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
        component: ProductLevelListComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    ProductLevelListComponent,
    AddProductLevelComponent,
    RemoveProductLevelComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: [ProductLevelsComponent]
})
export class ProductLevelsModule { }
