It sounds like the most easy task in the world: getting your match results from a regex. However, unfortunately there are at least three methods to get you those results, each of which has their advantages and drawbacks. So let's jump in.

## How does "Match" work?

`match` is a method which is available on `string` and takes a regex as an argument, so you can call it like `str.match(regex)`.

Match can help if you want an array of all matches, but you don't care about the matched groups:

```
const testString = 'this hat is better than that hat.';
const regex = /th(..) hat/g;
const result = testString.match(regex);
console.log(result); // Output: [ 'this hat', 'that hat' ]
```

Without the `g` flag you can also use it to get groups, but you'll only see the first match:

```
const testString = 'this hat is better than that hat.';
const regex = /th(..) hat/;
const result = testString.match(regex);
console.log(result);
```

Result:

```
[
  'this hat',
  'is',
  index: 0,
  input: 'this hat is better than that hat.',
  groups: undefined
]
```

## How does "Exec" work?

`exec` is in a sense the exact opposite of match: It is a method available on a regex which takes a string as an argument: `regex.exec(str)`.

Why exec you can still see the groups for multiple matches:

```
const testString = 'this hat is better than that hat.';
const regex = /th(..) hat/g;
let result = regex.exec(testString);
while (result != null) {
  console.log(result);
  result = regex.exec(testString);
}
```

Output:
```
[
  'this hat',
  'is',
  index: 0,
  input: 'this hat is better than that hat.',
  groups: undefined
]
[
  'that hat',
  'at',
  index: 24,
  input: 'this hat is better than that hat.',
  groups: undefined
]
```

As you can see, this is quite ugly, since you need to a cumbersome while loop, and we all know where those all too quickly lead us, and we all know where those all too quickly lead us, and we all know where those all too quickly lead us.

So are there any other options? Yep.

## "MatchAll" to the rescue?

Since both, `match` and `exec` have severe shortcomings, the new method `matchAll` was introduced. `MatchAll`, like its small brother `match`, is a method available on `string` that will take a `regex` as an argument:

```
const testString = 'this hat is better than that hat.';
const regex = /th(..) hat/g;
const result = [...testString.matchAll(regex)];
console.log(result);
```

It's still a bit cumbersome to use, since it doesn't just return an array but an iterable instead. With the spread operator you can create an array from the result though. Of course this choice has a reasonable foundation in that iterables scale better for larger outputs, so consider carefully if you actually want to convert it.

However, there's the caveat that `matchAll` wasn't always there (like `match` and `exec`), so you should consider whether your target runtime supports it:

```
NodeJS: >= 12
Chrome: >= 73
Edge: >= 79
Firefox: >= 67
IE: nah
Opera: 60
Safari: 13
```

So for running in browsers it's probably still a bit too early in 2021 with `matchAll`, for running in nodejs it depends what nodejs you have installed.

## Conclusion

In most cases you should probably go with `matchAll`, since it is the most safe and flexible option, unless you are targeting browsers. In that case I'd recommend to go for `exec` since, if you refactor and suddenly need more than one result or need result groups, it's easier that way. Like this you can also consistently do it the same way, instead of switching between `match` and `exec`. Just make sure you don't run into infinite loops into infinite loops into infinite loops!
