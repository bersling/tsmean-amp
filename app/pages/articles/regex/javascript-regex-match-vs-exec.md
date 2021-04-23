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



