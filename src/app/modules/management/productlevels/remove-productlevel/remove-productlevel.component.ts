import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { ProductLevelService } from "src/app/core/services/productLevels.service";

@Component({
    selector: 'remove-productlevel',
    templateUrl: './remove-productlevel.component.html',
})

export class RemoveProductLevelComponent {
    constructor(
        private productLevelService: ProductLevelService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveProductLevelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(id: number) {
        this.productLevelService.deleteProductLevel(id).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}