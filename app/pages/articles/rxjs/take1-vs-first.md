Are `take(1)` and `first()` the same? No. Learn what's the difference.

## take(1)
- Take(1) just takes the first emitted value, if there ever comes one

## first

- First optionally takes a predicate, so you can model "take the first value that satisfies a condition". Example: `first(age => age > 18)`
- First emits an error if the predicate isn't matched once the observable completes. 

## Example

```
  result = {};
  ngOnInit() {
    EMPTY.pipe(take(1)).subscribe(
      next => (this.result['take1'] = next),
      err => (this.result['take1'] = err)
    );
    EMPTY.pipe(first()).subscribe(
      next => (this.result['first'] = next),
      err => (this.result['first'] = err)
    );
  }
```

Result:

```
{
  "first": {
    "message": "no elements in sequence",
    "name": "EmptyError"
  }
}
```

Full example: https://stackblitz.com/edit/first-vs-take

Good SO answer regarding this: https://stackoverflow.com/a/42346203/3022127

## Which one should you choose?

Here this SO answer is very useful: https://stackoverflow.com/a/54209901/3022127.
