import { NgModule, Component, Input, ViewChildren, Output, ElementRef, forwardRef } from '@angular/core';
import { FormsModule, NgModel, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'file-upload',
    template: `
        <img [src]="image" height="100" (click)="click()" />
        <input type="file" #fileInput class="upload" accept="*" (change)="changeListener($event)" style="display:none;" />
        `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploadComponent),
            multi: true
        }
    ]
})
export class FileUploadComponent implements ControlValueAccessor {
    selectedFileName: string = null;
    image: string;

    @ViewChildren('fileInput') fileInput;

    writeValue(value: any) {
        this.image = value;
    }
    propagateChange = (_: any) => { };
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() { }

    click() {
        this.fileInput.first.nativeElement.click();
    }
    changeListener($event): void {
        // debugger; // uncomment this for debugging purposes
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        // debugger; // uncomment this for debugging purposes
        const file: File = inputValue.files[0];
        const myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.image = myReader.result;
            this.propagateChange(myReader.result);
            this.selectedFileName = file.name;
        }
        myReader.readAsDataURL(file);
    }
}

@NgModule({
    declarations: [
        FileUploadComponent
    ],
    imports: [FormsModule],
    exports: [
        FileUploadComponent
    ]
})
export class FileUploadModule { }
