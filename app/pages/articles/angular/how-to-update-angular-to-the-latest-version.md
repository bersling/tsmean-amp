First of all, try to do all changes incrementally and commit after every change with a sensible commit message. This will help you to reset to an earlier stage if you think something went wrong somewhere along the process. Next, let's have a look at how you can get from ngx to ngx+1.

The primary tool for doing so is `ng update`. It helps you automatically update all npm dependencies to versions that work well together and also **automatically migrates your code, where breaking changes were introduced**. Which is awesome.

Also, if you have a large codebase to migrate, make sure you have some task you can do in parallel. Because updating can take quite a while sometimes.

Finally, if you're running into some problems with the steps presented in the following: There's a troubleshooting section at the end, and if that doesn't help you'll have to resort to your favourite search engine, check issues on the angular github repo or join the Angular discord channel.

Now let's get started!

## How to migrate from ngx to ngx+1?

Let's get started with the "more or less happy flow".

### Check what is outdated

Run the following commands:
```
npm outdated
ng update
```

Both commands help you to get an overview of what should be updated.


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

Try to update the rest in the following order:

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

Now run your tests and lints and boot your application to check if everything is working as expected. If yes, congratulations, you have managed to migrate! If no, fix the remaining issues. One common issue at this point is that you have libraries that are built for older versions of Angular. Check if there are newer versions available and update to those as well.

Check the troubleshooting section, your problem might be addressed in there.

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
