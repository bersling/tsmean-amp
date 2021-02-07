<!--- you can also use standard html here! -->
<!--- Change delimiters -->
{{=<% %>=}}

A "Live Search" or "search as you type" functionality is one, where you type part of a word or search term and the results get loaded automatically. Automatically in the sense that the user doesn't need to hit a "Search" or "Go" button nor does he or she need to hit enter.

It is similar to an autocomplete functionality, but instead of just displaying a possible completion of the search term, the actual search results are loaded on the fly and displayed. For example, Google only has an autocomplete as of January 2021. This is usually the more common approach. A Live Search can be found for example in Apple Mail, even though there it is arguably more a "Filter as you type" functionality, since it doesn't need to make a request to a server.

The terminology isn't as clearly cut and there are a lot of nuances to it as you could see e.g. here [https://ux.stackexchange.com/questions/20607/is-there-a-name-for-this-instant-filter-search-pattern](https://ux.stackexchange.com/questions/20607/is-there-a-name-for-this-instant-filter-search-pattern) or here [https://hybrismart.com/2019/01/08/autocomplete-live-search-suggestions-autocorrection-best-practice-design-patterns/](https://hybrismart.com/2019/01/08/autocomplete-live-search-suggestions-autocorrection-best-practice-design-patterns/).

However, we'll get started with our live search now!

## Live Search example with Angular

The way to go for building something like this in Angular is with rxjs and observables. What we're going to build is an input field that emits debounced, distinct values while you're typing. This should be good enough for most use cases.

There are two parts for our solution. The search input field and the component using it. Let's call them `app-search-input` and `app-search-page`.

Let's start with the search input. It could look like this:

```
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {

  @Input() initialValue: string = '';
  @Input() debounceTime = 300;

  @Output() textChange = new EventEmitter<string>();

  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );

  subscriptions: Subscription[] = [];

  constructor() {
  }

  ngOnInit() {
    const subscription = this.trigger.subscribe(currentValue => {
      this.textChange.emit(currentValue);
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onInput(e: any) {
    this.inputValue.next(e.target.value);
  }
}
```

```html
<input type="text"
       placeholder="Enter your search term..."
       [value]="initialValue"
       (input)="onInput($event)">
```

So let's have a look at what's happening:

- When the input changes, the `onInput` gets triggerd
- This in return pushes the next value to the `inputValue` observable
- The `inputValue` observable is piped through a `debounceTime` rxjs operator and a `distinctUntilChanged` operator. `debounceTime` helps us to only emit a new value once the user has stopped typing for a certain amount of time. I found 300ms to be a comfortable value for this. `distinctUntilChanged` helps to not emit anything if the previous value would be the same as the current value. So for example if the user changes `x` to `y` then back to `x` in under 300ms, there's no new event.
- Once the trigger emits a new value, we emit it through the `textChange` event emitter

So how can we make use of this component now? One possibility is like this:

```
import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { StarWarsApiService, StarWarsResult } from "../swapi.service";

@Component({
  selector: "app-client-subs",
  templateUrl: "./client-subs.component.html",
  styleUrls: ["./client-subs.component.css"]
})
export class ClientSubsComponent {
  results: StarWarsResult | null = null;

  searchRequestSubscriptions: Subscription[] = [];

  constructor(private starWarsApiService: StarWarsApiService) {}

  onTextChange(changedText: string) {
    this.cancelPendingRequests();
    const starWarsSubscription = this.starWarsApiService
      .getResults(changedText)
      .subscribe(
        response => {
          this.results = response;
        },
        errorResponse => {
          alert("oh no, there was an error when calling the star wars api");
          console.error(errorResponse);
        }
      );
    this.searchRequestSubscriptions.push(starWarsSubscription);
  }

  cancelPendingRequests() {
    this.searchRequestSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
```

```html
<h2>Client using Subscribe / Unsubscribe pattern</h2>
<app-search-input (textChange)="onTextChange($event)"></app-search-input>
<ng-container *ngIf="results != null">
	<ol *ngIf="results.results.length > 0; else noResults">
		<li *ngFor="let item of results.results">
			{{item.name}}
		</li>
	</ol>
	<ng-template #noResults>
		No results
	</ng-template>
</ng-container>
```

What's happening is the following:

- The `searchInput` field emits a (debounced and distinct) value
- The client sends a request to the api
- The result is written to the `results` property
- On subsequent emissions of `searchInput`, the previous requests are cancelled

You could also rewrite this by using SwitchMap like so:

```
import { Component } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { StarWarsApiService, StarWarsResult } from "../swapi.service";

@Component({
  selector: "app-client-switchmap",
  templateUrl: "./client-switchmap.component.html",
  styleUrls: ["./client-switchmap.component.css"]
})
export class ClientSwitchmapComponent {
  searchTerm = new Subject<string>();
  results$: Observable<StarWarsResult> = this.searchTerm.pipe(
    switchMap(searchTerm => this.starWarsApiService.getResults(searchTerm)),
    catchError(errorResponse => {
      alert("oh no, there was an error when calling the star wars api");
      console.error(errorResponse);
      return of(null);
    })
  );

  constructor(private starWarsApiService: StarWarsApiService) {}

  onTextChange(changedText: string) {
    this.searchTerm.next(changedText);
  }
}
```

```html
<h2>Client using SwitchMap pattern</h2>

<app-search-input (textChange)="onTextChange($event)"></app-search-input>
<ng-container *ngIf="(results$ | async) as results">
	<ol *ngIf="results.results.length > 0; else noResults">
		<li *ngFor="let item of results.results">
			{{item.name}}
		</li>
	</ol>
	<ng-template #noResults>
		No results
	</ng-template>
</ng-container>
```

What's happening here is the following:

- The `searchInput` field emits a (debounced and distinct) value
- The client pushes those emissions into the `searchTerm` observable (which is an instance of a rxjs subject)
- The `searchTerm` is piped into a `switchMap`. The `switchMap` then maps the `searchTerm` observable into a `results$` observable by applying the http request to each emitted search term
- SwitchMap also automatically cancels all previous requests!

## See it in action on Stackblitz

Here you can see the live search with both clients in action: [https://stackblitz.com/edit/angular-live-search](https://stackblitz.com/edit/angular-live-search)!

## Should I use SwitchMap?

Most other tutorials are implementing autocomplete behaviour by using SwitchMap. And it's true, it is quite elegant that you don't have to manually unsubscribe. However, there are also some reasons against using SwitchMap:

- Most Angular devs know subscriptions (and unsubscriptions), but less are familiar with the switchMap operator
- SwitchMap can be more complicated to read and understand at first
- Depending on your starting point the switchMap solution might require more refactoring

In the end, you have to decide for yourself (and your team) which solution is best. There are arguments in both directions.

## Conclusion

Building a live search can be a daunting task at first. However, you don't really need more advanced concepts like switchMap etc. With quite little and simple code you can build a working live search, that cancels pending requests. But I don't want to say it's something that's totally easy to understand right away, it also took me quite some time to grasp all the concepts around this topic, so don't get discouraged if it takes you a while to understand!

<%={{ }}=%>
