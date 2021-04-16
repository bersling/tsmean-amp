## DRAFT


## Unexpected errors vs expected errors
There are two kinds of errors: "Expected errors" and "unexpected errors".

An example of an expected error is for example when a user enters something that you anticipate but still not tolerate, e.g. a password that doesn't conform with your password guidelines. It could also be an expired JWT token. It is an event you think is part of the "normal" control flow of your application.

An unexpected error is something you would not expect from a healthy program. It could be that the application cannot connect to the database and thus must crash. Or it could be that you reach a part of your application where you know something went terribly wrong but you don't know how to recover from it.

For expected errors, you typically don't have to do much. You can log them, you can report them back to the client, but you typically don't have to print the callstack since you won't need to do any debugging actions. You should also handle them in a way that doesn't stop the program from continuing.

For unexpected errors you need to either terminate the program or if it's something like an API call return a 500. You should also print the callstack, since the developer will have to debug this and figure out what went wrong where.

## Be specific


### Be careful when catching

It is seldomly a bad idea to catch very generic errors like e.g. in Java / Kotlin an "IllegalArgumentException" without rethrowing them. That way you might up catching errors that you didn't even want to catch!

For example, when you throw a `IllegalArgumentException` when a user already exists and catch it in another place like this:

[use-specific-errors-when-catching](use-specific-errors-when-catching)

It will then lead to an unwanted catching if something else goes wrong, e.g. something further down the callchain also throws an illegal argument exception but you wouldn't want to handle it like this.

Instead as the diff is showing, if you __have to__ catch, at least use a specific exception so you don't "overcatch" things that you didn't even want to catch.

