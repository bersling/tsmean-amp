A "Live Search" or "search as you type" functionality is one, where you type part of a word or search term and get loaded automatically. Automatically in the sense, the user doesn't need to hit a "Search" or "Go" button, nor does he or she need to hit enter.

It is similar to an autocomplete functionality, but instead of just displaying a possible completion of the search term, the actual search results are loaded on the fly and displayed. For example, Google only has an autocomplete as of January 2021. This is usually the more common approach. A Live Search can be found for example in Apple Mail, even though there it is arguably more a "Filter as you type" functionality, since it doesn't need to make a request to a server and the not matching results are just filtered out.

The terminology isn't as clearly cut and there are a lot of nuances to it as you could see e.g. here https://ux.stackexchange.com/questions/20607/is-there-a-name-for-this-instant-filter-search-pattern or here https://hybrismart.com/2019/01/08/autocomplete-live-search-suggestions-autocorrection-best-practice-design-patterns/.

However, we'll get started with our live search now!

```
code line 1
code line 2
```

## Live Search Example with Angular

The way to go for building something like this in Angular is with rxjs and observables. What we're going to build is an input field that triggers emits debounced, distinct values while you're typing. We think that this is enough for most needs.

There are two parts for our solution. The search input field and the component using it. Let's call them `app-search-input` and `app-search-page`.

`app-live-search`

## Why no SwitchMap?

In other tutorials you might have seen that the solution made use of the rxjs switchMap operator. So why aren't we using it here? I have a couple of reasons for this:

- Everybody programming Angular knows subscriptions (and unsubscriptions), but not everybody is familiar with switchMap
- I find the code more complicated to read
- The exact same behaviour can be reached without switchMap
- For more complex scenarios with multiple subsequent http requests that build on each other, the error handling gets tricky
- Depending on your starting point the switchMap solution might require a lot more refactoring

I studied solutions using switchMap for quite a bit and dedicated several hours to playing around with it (you can have a look here: https://stackblitz.com/edit/understanding-switch-map). In the end it just would have complicated things for me and with simple unsubscribes I could meet the requirements of my project easily. So I went that road and wanted to share this way of approaching the problem with you.

## Conclusion

Building a live search can be a daunting task at first. However, you don't really need more advanced concepts like switchMap etc. With quite little and especially simple code you can build a working live search, that still cancels pending requests.


## Further reading

If you have more complicated requirements than those, I've played around on Stackblitz with quite a few options around this concept: https://stackblitz.com/edit/understanding-switch-map?file=src%2Fapp%2Fmvp-client%2Fmvp-client.component.ts .
