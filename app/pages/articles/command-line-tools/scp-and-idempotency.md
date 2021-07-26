If you've ever ended up with a directory structure like this

```
dir1/dir1/...
```

you know the struggle is real.

## What is the potential pitfall with `scp -r`?

If you wrote something like

```
scp -r dir1 "${SERVER}:dir1"
```

I see a red flag. What you are trying to do is copying `dir1` from your machine to a server. This will work well the first time:

```
scp -r dir1 "${SERVER}:dir1"
ssh "${SERVER}" ls dir1 // output: hello.txt
```

But try this a second time, and you'll get:

```
scp -r dir1 "${SERVER}:dir1"
ssh "${SERVER}" ls dir1 // output: dir1, hello.txt
```

# How can you make `scp -r` work in an idempotent fashion?

The answer here is simple: Just omit the name of the target directory. It will then automatically use the name of the source directory:

```
scp -r dir1 "${SERVER}:~"
ssh "${SERVER}" ls dir1 // output: hello.txt
```

And testing for idempotency:

```
scp -r dir1 "${SERVER}:~"
ssh "${SERVER}" ls dir1 // output: hello.txt
```

# Conclusion

Having something like `scp -r MYDIR ...MYDIR` is a red flag. You should probably simply drop the second `MYDIR` and you are good to go!
