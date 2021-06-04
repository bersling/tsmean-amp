## `BehaviorSubject`: What is it?

- The last value is cached
- A subscriber will get the latest value synchronously upon subscription
- `BehaviorSubject` needs an initial value. It is nice that you then can e.g. say it is initially `null`, meaning you have no data yet.

## `ReplaySubject`: What is it?

- The last `n` values are cached for a certain time period
- A subscriber will get the latest `n` values emitted upon subscription
- `ReplaySubject` does not have an initial value.

## When should you use which BehaviorSubject and when Replay Subject?

A BehaviorSubject can be seen as the "base case", since it's got a simple API where you can easily fetch the last cached value.

The classic example for ReplaySubjects would of course be something where you need e.g. the last 10 values, think for example of a chat app.

Another time when `ReplaySubject` can be useful is in `take(1)`-kind of scenarios. Since a `BehaviorSubject` has an initial value, once you subscribe to it, you immediately get a value. With the `ReplaySubject` you can wait for the first value to arrive.

Example:

```
$userLoggedIn.pipe(take(1)).subscribe(isLoggedIn => {
  if (isLoggedIn) {
    // route to dashboard
  } else {
    // route to landing page
  }
})
```

If `$userLoggedIn` is a behavior subject initialized with `null`, you will get routed to the landing page. If it's a replay subject nothing will happen until the subscriber actually gets the first value.

Here's a full example: https://stackblitz.com/edit/replaysubject-vs-behaviorsubject
