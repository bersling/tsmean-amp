Your first guess when creating a custom checkbox component might be to just create a `div` with something inside. But this approach has several drawbacks:
- The accessibility is bad, since it's not an `input type="checkbox"` element
- `ngModel` and Angular forms cannot be used



https://stackblitz.com/edit/angular-custom-checkbox-component?file=src%2Fapp%2Fcustom-checkbox%2Fcustom-checkbox.component.ts
