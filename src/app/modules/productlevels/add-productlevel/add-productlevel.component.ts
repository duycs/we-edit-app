import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { CreateProductLevelVM } from 'src/app/shared/models/createProductLevelVM';

@Component({
    selector: 'add-productlevel',
    templateUrl: './add-productlevel.component.html',
})

export class AddProductLevelComponent implements OnInit {
    form!: FormGroup;
    title: string = "Add Product-Levels";

    constructor(private fb: FormBuilder,
        private productLevelService: ProductLevelService,
        private dialogRef: MatDialogRef<AddProductLevelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            code: [null, Validators.required],
            description: [null]
        });
    };

    public save(): void {
        let createProductLevelVM: CreateProductLevelVM = {
            name: this.form.get('name')?.value,
            code: this.form.get('code')?.value,
            description: this.form.get('description')?.value,
        };

        this.productLevelService.addProductLevel(createProductLevelVM)
            .subscribe(() => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

        this.dialogRef.close({ event: "save", data: this.form.value });
    }

    close() {
        this.dialogRef.close({ event: "close", data: this.form.value });
    }

}