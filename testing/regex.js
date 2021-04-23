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
