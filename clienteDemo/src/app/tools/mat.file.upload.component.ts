import { NgModule, Component, Input, ViewChildren, Output, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-mat-file-upload',
    template: `
        <img [src]="image" height="100" (click)="click()" />
        <input type="file" #fileInput
            class="upload" accept="*" (change)="changeListener($event)" style="display:none;" />
        `,
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: forwardRef(() => MatFileUploadComponent)
          },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MatFileUploadComponent),
            multi: true
        }
    ]
})
export class MatFileUploadComponent implements ControlValueAccessor, MatFormFieldControl<string>, OnDestroy {
    static nextId = 0;

    id = `my-tel-input-${MatFileUploadComponent.nextId++}`;
    ngControl: NgControl;
    focused = true;
    errorState: boolean;
    autofilled?: boolean;
    controlType = 'app-mat-file-upload';

    stateChanges = new Subject<void>();
    private _placeholder: string;
    private _required = false;
    private _disabled = false;

    selectedFileName: string = null;
    image: string;
    describedBy = '';

    @ViewChildren('fileInput') fileInput;

    onContainerClick(event: MouseEvent): void {
        return;
    }

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
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        const file: File = inputValue.files[0];
        const myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.image = myReader.result;
            this.propagateChange(myReader.result);
            this.selectedFileName = file.name;
        };
        myReader.readAsDataURL(file);
    }


    get empty() {
        return !this.image;
    }

    get shouldLabelFloat() { return true; }


    @Input()
    get placeholder() { return this._placeholder; }
    set placeholder(plh) {
        this._placeholder = plh;
        this.stateChanges.next();
    }

    @Input()
    get required() { return this._required; }
    set required(req) {
        this._required = req;
        this.stateChanges.next();
    }

    @Input()
    get disabled() { return this._disabled; }
    set disabled(dis) {
        this._disabled = dis;
        this.stateChanges.next();
    }

    @Input()
    get value(): string | null {
        return this.image;
    }

    set value(value: string | null) {
        this.image = value;
        this.stateChanges.next();
    }

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }
    ngOnDestroy() {
        this.stateChanges.complete();
    }
}

