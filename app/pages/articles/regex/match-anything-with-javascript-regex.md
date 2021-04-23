
To "match anything" is one of the most common use cases for regex, or at least to have strings or match groups A and B and then match anything in between them. The methods to do so can basically be divided in two: Matching every thing on the same line or matching anything even with linebreaks. So that's what were gonna have a look at now.

## Match on one line

```
const testString = `
Hello World!
I will always be here for you.
Yours Sincerely
`
const regex = /I will(.*?)for you./
console.log(regex.exec(testString));
```

Result:

```
[
  'I will always be here for you.',
  ' always be here ',
  index: 14,
  input: '\nHello World!\nI will always be here for you.\nYours Sincerely\n',
  groups: undefined
]
```

## Match over multiple lines

This is where it becomes a little more tricky, but only a little.

### In modern JS versions: Use dotall

You can now pass your regex the "dotall" flag, which means `.` also matches newlines. The flag to do so is `s`.

```
const testString = `
A
B
C
D
`
const regex = /A(.*?)D/s
console.log(regex.exec(testString));

// Output:
// [
//   'A\nB\nC\nD',
//   '\nB\nC\n',
//   index: 1,
//   input: '\nA\nB\nC\nD\n',
//   groups: undefined
// ]
```

So what does modern JS versions mean here? Theoretically it means ES2018, 9th edition of JavaScript, but in reality you should be more concerned with whether your runtime supports it:

```
NodeJS: >= 10.3
Chrome: >= 62
Edge: >= 79
Firefox: >= 78 
IE: nah
Opera: 49
Safari: 12
```

So this means in a browser this is not safe to use yet, but in NodeJS you can probably go for it if you're not running a quite old version.

### For older JavaScript versions (pre ES2018, 9th edition)

```
const testString = `
import {
  A,
  B,
  C
}
import {
  E,
  F
}
`
const regex = /import ([\s\S]*?})/g
console.log(regex.exec(testString));
```

Or if you prefer to work with `new RegExp`, but take care of the escaping:

```
const testString = `
import {
  A,
  B,
  C
}
import {
  E,
  F
}
`
const regex = new RegExp('import ([\\s\\S]*?})', 'g')
console.log(regex.exec(testString));
```

Result:

```
[
  'import {\n  A,\n  B,\n  C\n}',
  '{\n  A,\n  B,\n  C\n}',
  index: 1,
  input: '\nimport {\n  A,\n  B,\n  C\n}\nimport {\n  E,\n  F\n}\n',
  groups: undefined
]
```


## Pitfalls

- Dotall only exists since ES2018
- Do NOT use the multiline flag when matching on multiple lines. It is the opposite of what you want since it cuts the string into its individual lines.
- Beware of escaping, as the examples show. Since it's simpler with the `/.../` syntax I'd suggest to always go for this when using regex, since regex is illegible enough as it is.
- Think about whether regex is the right tool, do not write html parsers with it ;)

## Conclusion

Regex + Match Anything is a powerful tool. The basic syntax is `.` for single-line or with the `s` flag for multi-line matching, or `[\s\S]` for multi-line matching on older JS versions.

I find myself mostly using the non-greedy versions with match groups: `(.*?)`. I can sometimes even manage to type it out correctly on the first try. 😉
