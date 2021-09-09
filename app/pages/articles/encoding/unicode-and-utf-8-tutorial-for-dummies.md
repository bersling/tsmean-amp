Understanding everything about encoding isn't an easy job. Most tutorials start with explaining to you the history of encoding, but you really don't have to know about all that stuff to get a basic understanding of unicode and UTF-8. So here we'll go, I promise to make it as short and simple as humanly possible.

## Unicode

You can think of unicode as a **map of every possible character to a number**. A character in the broader sense, e.g. an emoji is also a character.

Examples :

```
A = 65
µ = 181
ż = 380
╬ = 9820
丠 = 20000
☠ = 9760
😍 = 128525
```

or if you prefer in hex (machines prefer it that way and it's very common with unicode):

```
A = U+41
µ = U+B5
ż = U+380
╬ = U+17C
丠 = U+4E20
☠ = U+2620
😍 = U+1f60d
```

Unicode characters in hex are also often prefixed with `U+`. You might also see a prefix of `0x` (general machine readable hex prefix). We'll continue in this article by using the decimal representation.

Note: Unicode represents an **idea** of a character, not what you see on the screen directly. For example `A` or `😍` is displayed on your screen in a certain font, the pixels are arranged in a certain way.
But what unicode represents is not the arrangement of pixels, but the idea of the "A" or the "Love eyes emoji". So depending on your font or your system,
the pixel arrangement might be different.

### Why is unicode great?

- It's a widely agreed upon standard
- It's extensible. If new things come up, like the emojis, simply assign them to new numbers. Since we've got an infinite amount of natural numbers, there will never be a problem.

## UTF-8

So the number has to be stored somehow on your computer. Your computer only stores ones and zeroes in the end, and UTF-8 species how to **read a sequence of ones and zeroes to get back the unicode numbers**.

### Motivation (NOT UTF-8)

Now you think, wait, why don't you just do it like this:

```
`A` = 65 = 1100101
```

The problem becomes evident if you try to put together two characters:

```
A😍 = 65128525 = 110010111111011000001101
        ↑               ↑
       here the new character starts,
       but it could also be read as one big number
       instead of two numbers.
       So we need a way to separate two numbers.
```

Ok, so we need a way to represent two characters. We could for example just say each character gets 32 bits:

```
A😍 = 0000000000000000000000000110010100000000000000011111011000001101
                                ↑
                    here starts the second character
```

As you can see we're wasting quite a lot of disk space or memory here with so many unused zeroes.
If on the other hand we just say we're only using 16 bits, then as more characters (example: more and more emojis)
get added, a limit might be reached too quickly.

### Enter UTF-8, a "smarter" encoding

I think it is easiest to just explain it with an example. Let's encode `A☠😍` in UTF-8!

```
A☠😍 = 01000001 11100010 10011000 10100000 11110000 10011111 10011000 10001101
       |______| |________________________| |_________________________________|
          |                  |                              |
          A                  ☠                              😍
```

So we right away notice one thing: The characters with a smaller number in unicode (remember `A=65`, `☠=9760`, `😍=128525`) **take up less space**.

But then, how does the computer know where one character stops and the next starts?

The trick is: Not all bits are used to encode the actual characters, some bits are used to encode how many bits **belong** to a character instead!

Those "header bits" are **all those up to the first zero** and they are to be read like this:

- `0` means the entire char is contained in **one byte**. Note we have used the word byte for the first time here.
- `110` means there are **two bytes** that belong to this character, so the the one where `110` is found and the next one.
- `1110` means there are **three bytes** that belong to this character, so the the one where `1110` is found and the next two.
- `11110` means there are **four bytes** that belong to this character, so the the one where `11110` is found and the next three.

Note: Even though this idea could be continued, the maximum bytes per character is four, so the list above is actually complete.

Now, there's one with a special meaning:

- `10` means that it's a **continuation byte**.

The **actual code numbers are then retrieved by dropping the header bits and putting together what belongs together**:

- A: `01000001` => `0` means everything in one bit, so after dropping the `0` we get: `1000001 = 65 = A` !
- ☠: We continue reading and find `1110`. This means there are three bytes that belong to this character so let's collect them: `11100010 10011000 10100000`. Now that we have those, let's drop all the header bits: `00010 011000 100000 = 9760 = ☠`
- 😍: After having read in all those bits, we're now arriving at the next byte: `11110000`. Wow, looks like a four byte character since the header is `11110`! So we'll collect the bytes: `11110000 10011111 10011000 10001101`, then drop the header bits and get: `000 011111 011000 001101 = 128525 = 😍`

We've successfully read a binary sequence encoded in UTF-8! `🥳 = U+1F973 = 11110000 10011111 10100101 10110011`

Now the historical reason why UTF-8 is exactly this way has some more interesting details to it, of which I'd just like to mention two:

- If you know ASCII, you might know that it's a 7 bit system. The first unicode points are exactly the same as ASCII, so all UTF-8 characters from `00000001` to `011111111` exactly represent ASCII. This helps with backwards compatibility for old ASCII programs.
- It is interesting to notice that there are never 8 consecutive zeroes in our bit sequence. This is also advantageous for backwards compatibility since 8 consecutive zeroes mean for old programs "NULL" which means the string has ended and the program should stop continue reading.

## Conclusion

Understanding unicode is quite easy, UTF-8 is a little trickier. Unicode assigns a number to each character in the universe and is the de facto standard to do so. UTF-8 is considered with storing the numbers on your machine in a way that they don't take up too much space and can also be read again once stored. To do so it uses some header bits on each byte, that tell you how many bytes belong to a character.