import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from 'src/app/material.module';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthenticationComponent } from './authentication.component';

const routes: Routes = [
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'callback', component: AuthCallbackComponent },
            { path: 'notfound', component: NotFoundComponent },
            { path: 'forbidden', component: ForbiddenComponent }
        ]
    }
];

@NgModule({
    declarations: [
        RegisterComponent,
        LoginComponent,
        AuthCallbackComponent,
        ForbiddenComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class AuthenticationModule { }