import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize } from 'rxjs/operators'
import { UserRegistration } from 'src/app/shared/models/userRegistration';
import { AuthService } from '../../core/authentication/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    title = "Register";
    hide = true;
    success!: boolean;
    error!: any;

    userRegistration: UserRegistration = { name: '', email: '', password: '' };
    submitted: boolean = false;

    constructor(private authService: AuthService, private fb: FormBuilder, private spinner: NgxSpinnerService) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            name: [null, Validators.required],
            password: [null, Validators.required],
            email: [null, Validators.required],
        });
    }

    onSubmit() {
        this.spinner.show();
        let userRegistration = {
            name: this.form.get('name')?.value,
            email: this.form.get('email')?.value,
            password: this.form.get('password')?.value,
        };
        this.authService.register(userRegistration)
            .pipe(finalize(() => {
                this.spinner.hide();
            })
            )
            .subscribe(
                result => {
                    if (result) {
                        this.success = true;
                        this.clearForm();
                    }
                },
                error => {
                    console.log("error", error);
                    this.error = error;
                });
    }

    login() {
        this.authService.login();
    }

    clearForm() {
        this.form = this.fb.group({
            name: [null, Validators.required],
            password: [null, Validators.required],
            email: [null, Validators.required],
        });
    }
}