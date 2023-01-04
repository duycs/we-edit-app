import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "src/app/material.module";
import { SharedModule } from "src/app/shared.module";
import { StaffComponent } from "../staff/staff.component";
import { EditorComponent } from "./editor/editor.component";
import { ImageComponent } from "./image.component";

const routes: Routes = [
    {
        path: 'images',
        component: ImageComponent,
        children: [
            // images
            {
                path: 'editor',
                component: EditorComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        EditorComponent,
    ],
    imports: [
        SharedModule,
        MaterialModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    bootstrap: [StaffComponent]
})
export class ImageModule { }
