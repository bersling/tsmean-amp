First of all, try to do all changes incrementally and commit after every change with a sensible commit message. This will help you to reset to an earlier stage if you think something went wrong somewhere along the process. Next, let's have a look at how you can get from ngx to ngx+1.

The primary tool for doing so is `ng update`. It helps you automatically update all npm dependencies to versions that work well together and also **automatically migrates your code, where breaking changes were introduced**. Which is awesome.

Also, if you have a large codebase to migrate, make sure you have some task you can do in parallel. Because updating can take quite a while sometimes.

Finally, if you're running into some problems with the steps presented in the following: There's a troubleshooting section at the end, and if that doesn't help you'll have to resort to your favourite search engine, check issues on the angular github repo or join the Angular discord channel.

Now let's get started!

## How to migrate from ngx to ngx+1?

Let's get started with the "more or less happy flow".

### Check what is outdated

Run the following commands and put the outputs in a text file:
```
npm outdated > tmp.ng-update.txt
ng update > tmp.npm-outdated.txt
```

Both commands give you information that you might want to refer to multiple times in this process.

#### Remove @angular/http

If you still have the `@angular/http` package in your `package.json` you can remove it with the newer angular versions. Otherwise it'll throw errors like the following:

```
Package "@angular/http" has an incompatible peer dependency to ...
```

### ng update @angular/core

I found it to be most reliable to update `@angular/core` as the first package. To do so, you can run:
```
ng update @angular/core
```

### Incompatible peer dependencies found: What now?
It is quite likely that this will fail because of "Incompatible peer dependencies found.".
At first, I tried to be a good citizen and go after each of the offending peer dependencies one after another. However, I found that this is a rather pointless endeavour. It's usually easier to just run the update with force: `ng update @angular/core --force`

### Pay attention to the output
Angular will print in yellow things that could not be migrated by `ng update`. You should proceed to manually fix those issues.

### Check the diff
Angular tries to update your code where they introduced breaking changes. However, don't blindly trust what those migrations are doing. You should check all diffs and see if they did the correct thing. It'll cost you a bit of time, but you'll also learn about the new features and design decisions in Angular, so might save you some time in the long run.

### Update rest of packages

Try to update the rest in the following order `@angular/cli`:
- `ng update @angular/cli`
- `ng update @angular/material`

The latter should also update `@angular/cdk`. Remember to commit in between the steps.

Again, if it's not working, use force.

### Check that you are up to date

Run `ng update` one last time to make sure all packages are updated:

```
ng update
```

It should tell you that you are good to go.

### Testing

Now run your tests and lints and boot your application to check if everything is working as expected. If yes, congratulations, you have managed to migrate! If no, fix the remaining issues. Check the troubleshooting section, your problem might be addressed in there.


## Alternative: The ng new approach
If you have some project that (a) you haven't touched in a very long time and (b) has quite little code, it might be easiest to just create a new app with `ng new` and then copy over the `src` directory. In that case you can proceed as follows to keep your git history:

1. Make sure you are on the latest angular cli version
```
ng version // prints latest version?
npm install -g @angular/cli
```

2. Create a new app
```
ng new myapp
```
or a new library (https://angular.io/guide/creating-libraries)
```
ng new mylib --create-application=false
```

3. Copy some of the old files
- src directory
- `.git` directory

4. Check if everything is running
5. commit and push

## Troubleshooting

Here are some tips and tricks for when things don't go as planned.

### I messed up, what now?

You can use git to revert, but be careful with hard resets:

```
git checkout -b backup-fucked-up-branch
git checkout fucked-up-branch
git reset --hard last-ok-commit
```

### Why is `next` installed?
Sometimes the linking of packages through `ng update` is not correct and a package with `-next` is installed, even though you didn't ask for a beta version. If this happens for a package, e.g. `@angular/cli`, try to update another package first. Also check github / google for the issue.

### `npm ERR! notarget No matching version found for xxx`

Sometimes `ng update` installs non-existing package versions, e.g.:

```
npm ERR! notarget No matching version found for @angular-devkit/build-ng-packagr@~0.1102.9.
npm ERR! notarget In most cases you or one of your dependencies are requesting
npm ERR! notarget a package version that doesn't exist.
npm ERR! notarget 
npm ERR! notarget It was specified as a dependency of 'toast'
npm ERR! notarget 
```

in this case you'll have to re-install the said package yourself with:

```
npm install @angular-devkit/build-ng-packagr@latest
```

###  Generic type 'ModuleWithProviders<T>' requires 1 type argument(s)
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

If it's a library which has the problem, you could consider the following approach:
```
declare module "@angular/core" {
    interface ModuleWithProviders<T = any> {
        ngModule: Type<T>;
        providers?: Provider[];
    }
}
```

Angular claims libraries are automatically converted by ngcc (https://angular.io/guide/migration-module-with-providers), but that wasn't the case for me when I tried it out.

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

If you continue having this error see https://stackoverflow.com/questions/60234048/angular-9-library-publish-error-trying-to-publish-a-package-that-has-been-compi/67177241#67177241 .


