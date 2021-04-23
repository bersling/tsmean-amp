## What you want to match is on one line

```
const testString = `
Hello World!
I will always be here for you.
Yours Sincerely
`
const regex = /I will(.*?)for you./
console.log(regex.exec(testString));
console.log(testString.match(regex));
```

## What you want to match spans over multiple lines

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
console.log(testString.match(regex));
```

Or if you prefer to work with `new RegExp`:

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
console.log(testString.match(regex));
```


## Pitfalls

- Do NOT use the multiline flag when matching on multiple lines. It is the opposite of what you want since it cuts the string into its individual lines.
- Beware of escaping, as the examples show. Since it's simpler with the `/.../` syntax I'd suggest to always go for this when using regex, since regex is illegible enough as it is.
- Think about whether regex is the right tool, do not write html parsers with it ;)

## Conclusion

Regex + Match Anything is powerful tool. The basic syntax is `.` for single-line and `[\s\S]` for multi-line matching. I find myself mostly using the non-greedy versions with match groups: `(.*?)` and `([\s\S]*?)`. Especially the `(.*?)` I use quite often, I can sometimes even manage to type it out correctly on the first go. 😉

