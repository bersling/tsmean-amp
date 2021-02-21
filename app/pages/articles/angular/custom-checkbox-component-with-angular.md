Your first guess when creating a custom checkbox component might be to just create a `div` with something inside. But this approach has several drawbacks:

- The accessibility is bad, since it's not an `input type="checkbox"` element
- `ngModel` and Angular forms cannot be used

This is where the Angular Control Value Accessor (CVA) comes into play. If you implement this interface, you teach Angular how to access "the" value associated with the component and thus enabling ngModel. There's a full article at [Angular Control Value Accessor Tutorial](/articles/angular/angular-control-value-accessor-example/). Here we're not explaining in detail how CVA is working, but instead we'll just show you how to implement a custom checkbox right away:

```html
<label class="checkbox-container">
  <input
    class="checkbox-input"
    type="checkbox"
    [ngModel]="checked"
    (ngModelChange)="onModelChange($event)"
  />
  <div class="checkbox-border">
    <div class="checkbox-filling" *ngIf="checked"></div>
  </div>
  <ng-content> </ng-content>
</label>
```

```typescript
import { Component, OnInit, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

@Component({
  selector: "app-custom-checkbox",
  templateUrl: "./custom-checkbox.component.html",
  styleUrls: ["./custom-checkbox.component.scss"],

  // Step 1: copy paste this providers property
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckboxComponent),
      multi: true
    }
  ]
})
// Step 2: Add "implements ControlValueAccessor"
export class CustomCheckboxComponent implements ControlValueAccessor, OnInit {
  // Step 3: Copy paste this stuff here
  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  constructor() {}

  ngOnInit() {}

  // Step 4: Define what should happen in this component, if something changes outside
  checked: boolean = false;
  writeValue(checked: boolean) {
    this.checked = checked;
  }

  onModelChange(e: boolean) {
    // Step 5a: bind the changes to the local value
    this.checked = e;

    // Step 5b: Handle what should happen on the outside, if something changes on the inside
    this.onChange(e);
  }
}
```

Here's the code on Stackblitz for the [custom checkbox with angular](https://stackblitz.com/edit/angular-custom-checkbox-component?file=src%2Fapp%2Fcustom-checkbox%2Fcustom-checkbox.component.ts).

And here's what you'll get:

<amp-img class="app-row-img mw600"
         layout="responsive"
         width="968"
         height="1266"
         src="/assets/img/angular/custom-form-control-cva-angular.png">
</amp-img>
