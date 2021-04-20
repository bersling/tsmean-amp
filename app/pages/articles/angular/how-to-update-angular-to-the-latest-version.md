- Seems to be doing all anyways?

### Troubleshooting

#### `npm ERR! notarget No matching version found for xxx`

You might have accidentally typed `npm install somepackage@non-existing-version`. You can fix it by running `npm install somepackage@latest`.

#### Package "@angular/http" has an incompatible peer dependency to ...

This package is deprecated, you should be able to remove it.

#### Typescript Compilation Troubleshooting

#####  Generic type 'ModuleWithProviders<T>' requires 1 type argument(s)
```
✖ Compiling TypeScript sources through NGC
ERROR: projects/tsmean/spinner/src/lib/spinner.module.ts:16:53 - error TS2314: Generic type 'ModuleWithProviders<T>' requires 1 type argument(s).

16   static forRoot(spinnerSettings: SpinnerSettings): ModuleWithProviders {
                                                       ~~~~~~~~~~~~~~~~~~~
```

Just put the class name as the argument in the generic:
```
export class SpinnerModule {
  static forRoot(spinnerSettings: SpinnerSettings): ModuleWithProviders<SpinnerModule> {
```

##### ERROR: Trying to publish a package that has been compiled by Ivy. This is not allowed.
You'll need to add the `--prod` flag to your build command:

Before:
```
    "build-spinner": "ng build @tsmean/spinner",
```

After:
```
    "build-spinner": "ng build @tsmean/spinner --prod",
```

If you continue to see the error, you can try the following:

Add this file `projects/myproject/tsconfig.lib.prod.json`:
```
{
  "extends": "./tsconfig.lib.json",
  "angularCompilerOptions": {
    "enableIvy": false
  }
}
```

And then replace the line in `angular.json`
```
"project": "projects/myproject/ng-package.prod.json"
```
with this one
```
"tsConfig": "projects/tsmean/spinner/tsconfig.lib.prod.json"
```
in the section `myproject.architect.build.configurations.production`.
