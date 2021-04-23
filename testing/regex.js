const testString = 'this hat is better than that hat.';
const regex = /th(..) hat/g;
let result = regex.exec(testString);
while (result != null) {
  console.log(result);
  result = regex.exec(testString);
}
