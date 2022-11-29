import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { FilterService, GridModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ProductLevelsComponent } from './productlevels.component';
import { ProductLevelListComponent } from './productlevel-list/productlevel-list.component';
import { MaterialModule } from 'src/app/material.module';
import { AddProductLevelComponent } from './add-productlevel/add-productlevel.component';

const routes: Routes = [
  {
    path: 'productLevels',
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
  ],
  imports: [
    DropDownListModule,
    ButtonModule,
    DialogModule,
    UploaderModule,
    GridModule,
    BrowserModule,
    SharedModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService],
  bootstrap: [ProductLevelsComponent]
})
export class ProductLevelsModule { }
