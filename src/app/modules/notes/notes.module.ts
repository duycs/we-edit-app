import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { NotesComponent } from './notes.component';
import { NoteListComponent } from './note-list/note-list.component';
import { RemoveNoteComponent } from './remove-note/remove-note.component';

const routes: Routes = [
  {
    path: 'notes',
    component: NotesComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
        component: NoteListComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    NoteListComponent,
    RemoveNoteComponent,
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
  bootstrap: [NotesComponent]
})
export class NotesModule { }
