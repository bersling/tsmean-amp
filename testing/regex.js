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
