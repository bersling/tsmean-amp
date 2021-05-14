{{=<% %>=}}


Picking the right frontend framework isn't an easy task in 2021. Yet, however you have decided, there are concepts that are present in all frameworks. The concepts just might have a different name and implementation.

The big four currently are React, Angular, Vue and Svelte. Most articles compare what's **different** about them and makes each one unique. However, for a developer it's also interesting to know what are the basic concepts that are common to all of them. What's the true core of a component centric frontend framework? Those are the things that are most valuable for developers to understand, since they'll always be around, even after switching frameworks.

The code snippets **are not meant to start a framework war** about which one is shorter or which one you prefer more. It's just a means of illustrating the different implementations of the common concepts.

So let's dive into it and have a look at what those frameworks have all in common.


# Table of Contents
- [Components](#components)
    - [Selectors](#selectors)
    - [Passing data into a child component (Props)](#passing-data-into-a-child-component-props)
    - [Child to parent communication](#child-to-parent-communication)
    - [Lifecycle Hooks](#lifecycle-hooks)
- [Templates](#templates)
    - [Interpolation](#interpolation)
        - [XSS Protection and opting out](#xss-protection-and-opting-out)
- [Lists](#lists)
    - [Iterating over Objects](#iterating-over-objects)
    - [Getting the Index](#getting-the-index)
    - [Keys: Deciding which DOM elements to keep and which to replace](#keys-deciding-which-dom-elements-to-keep-and-which-to-replace)
- [Conditional Rendering (If, else if, else, switch)](#conditional-rendering-if-else-if-else-switch)
- [Extracting values from native controls](#extracting-values-from-native-controls)
- [Misc](#misc)
  - [Directives](#directives)
  

## Components

The most obvious thing is components, since the whole article revolves around the component centric frameworks. Components are great since they allow you to compose your application of reusable and testable building blocks, and who wouldn't want that. So basically all modern frontend applications are built around a component centric model.

What is a component exactly? A component is a unit that encapsulates things. All frameworks encapsulate HTML and JS/TS. Some of them also encapsulate CSS. The basic syntax for defining a component differs for the frameworks.

```React
// Class based approach
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// alternative: function based approach
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

```Angular
@Component({
  selector: 'app-component-overview',
  templateUrl: './component-overview.component.html',
  styleUrls: ['./component-overview.component.css']
})
export class ComponentOverviewComponent {

}
```

```Vue
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

```Svelte
<script>
	// logic goes here
</script>

<style>
	/* styles go here */
</style>

<!-- markup (zero or more items) goes here -->
```

As you can see, the syntax is quite different for the frameworks, but they serve the same purpose: Isolating the business logic (JS) and structure (HTML) of a specific part of your application.

To achieve those means, completely different approaches are chosen:
- React lets you extend the React.Component in a JSX file, which contain the logic and also the HTML (through the `render() {return <your html here>}`). So they've invented a whole new file extension (`.jsx`) where the components live in.
- Angular works with annotations and usually defers HTML and CSS to external files, even though it can also be defined inline
- Vue lets you call a method on the `Vue` global object
- Svelte encapsulates logic (js), structure (html) and style (css) in `.svelte` files. So much like React, in Svelte there's also file type dedicated to hold the components

### Selectors
There needs to be a way of referencing a component in other components in order to include them and build the tree structure that we want. To do so, each component must receive a unique name. The frameworks how different ways of specifying that name.

```React
// Class based
class Goodbye extends React.Component {}

// usage in another component
import {Goodbye} from './SomeFile';
...
<Goodbye/>
```

```Angular
// some component
@Component({
  selector: 'app-component-overview'
})
export class ComponentOverviewComponent {

}

// usage in another component
<app-component-overview></app-component-overview>

// Note: To make this work, we'll have to register ComponentOverviewComponent in a module
// However, we'll not touch modules here since they are not part of the commonalities amongst frameworks
```

```Vue
// Selector is the first argument
Vue.component('todo-item', {
  template: '<li>This is a todo</li>'
})

// usage in another component
<todo-item></todo-item>
```

```Svelte 
// usage in another component
<script>
  import Nested from './Nested.svelte';
</script>
<Nested/>
```

What's interesting to note is:

- The way of declaring the name of a component is quite different, with Angular and Vue letting the component itself determine its name whereas React and Svelte lean more towards the component being named when importing (even though usually the name will be determined by the filename or class name)
- The way of using the components is quite similar, the difference being that Angular and Vue use the `<bla></bla>` syntax where React and Svelte opt for the `<Bla/>` syntax.


### Passing data into a child component (Props)

Another common feature amongst the dominating frameworks is that they allow data to be passed into components. The data that can be passed into a component is often called "props", since it reflects the properties of that component.

```React
// child
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}

// usage in parent
<Square value={i} />
```

```Angular
// child
class BankAccount {
  @Input() bankName: string;
}

// usage in parent
<bank-account bankName="RBC"></bank-account>
```

```Vue
// child
app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})

// usage in parent
<todo-item v-bind:todo="item"
></todo-item>
```

```Svelte
// child
<script>
	export let answer; // made into a prop by use of the export keyword
</script>

// usage in parent
<Nested answer={42}/>
```

### Child to parent communication

TODO

### Lifecycle Hooks

You'll sometimes have the need to do certain things at certain stages of a component's life, most typically:

- initialization logic on creation
- clean up logic on destruction

Thus the concept of lifecycle hooks (aka. lifecycle methods) is present in all frameworks. The available lifecycle methods don't have a 1:1 mapping for the frameworks so let's just take some of them from the docs for each of the frameworks.

```React
  componentDidMount() {
    // runs after the component output has been rendered to the DOM
  }
  componentWillUnmount() {
    // place for tear down
  }
```

```Angular
@Component()
export class MyComponent implements OnInit, OnDestroy {

  // implement OnInit's `ngOnInit` method
  ngOnInit() {
    .. some logic. this happens before rendering to the DOM, so you can perform setup logic here
  }
  
  ngOnDestroy() {
     ... tear down
  }

}
```

```Vue
export default {
  setup() {
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```

```Svelte
<script>
    // The one you'll use most frequently is onMount, which runs after the component is first rendered to the DOM.
	import { onMount } from 'svelte';

	let photos = [];

	onMount(async () => {
		const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		photos = await res.json();
	});
</script>
```




## Templates

The HTML is usually called `template` instead of `HTML`. Why is that so? Well, because it isn't directly rendered into the DOM as-is. Rather it is a template for the HTML that will later be produced. The term stems from templating engines in general (see here: https://en.wikipedia.org/wiki/Template_processor), where you have a `templating engine` that takes `template + data` and spits out `some output`, in our case what finally gets rendered to the DOM.

Again, even though the concept is there for all the frameworks, the syntax varies drastically. It doesn't make too much sense to compare "a minimal template", since those would all look like `<h1>Hello world</h1>`. The difference how templating works will become more apparent as we see other common concepts and how they differ. We can however make some general remarks about the templates for each framework.

- React has a unique approach for templates among those frameworks. The difference is that the other frameworks define their own templating language, whereas React tries to use JavaScript concepts to get jobs like iterating over arrays done.
- Angular has its own templating syntax with things like `*ngIf` or `*ngFor`
- Vue hast its own templating syntax with things like `v-if` and `v-for`
- Svelte has its own templating syntax with things like `{#if}` and `{#each}`

Within the templates, there are also a lot of common concepts that each framework has its own syntax for. We'll cover those next.

### Interpolation

> "Text interpolation allows you to incorporate dynamic string values into your HTML templates" AngularDocs

```React
<p>{this.state.name} World</p>
```

```Angular
<p>{{this.name}} World</p>
```

```Vue
<span>Message: {{ msg }}</span>
```

```Svelte
<h1>Hello {name}!</h1>
```

As you can see, interpolation has almost the same syntax in all frameworks. The only thing it seems they couldn't agree on were the optimal number of curly braces.

#### XSS Protection and opting out

One of the cool things about the modern frameworks is that they give you basic protection against XSS out of the box. They won't just put `<script>alert('evil')</script>` into the DOM by interpolation, rather they'll escape `<` and `>` so it's all just text. If you still want to put HTML through interpolation in your markup you can do so in the following ways:

```React
<div dangerouslySetInnerHTML={createMarkup()} />
```

```Angular
...
<div [innerHTML]="safeVal"></div>
...
constructor(private sanitizer:DomSanitizer){}
...
myVal = '<div>...'
safeVal = this.sanitizer.bypassSecurityTrustHtml(myVal)
```

```Vue
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

```Svelte
<p>{@html msg}</p>
```

## Lists

It's obvious that rendering lists by iterating over arrays is a core feature of all those frameworks. Here's how it's done for each of them.

```React
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => <li>{number}</li>);
return (
  <ul>{listItems}</ul>
);
```

```Angular
<ul>
  <li *ngFor="let number of numbers">{{number}}</li>
</ul>
```

```Vue
<ol>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ol>
```

```Svelte
<ul>
  {#each cats as cat}
    <li>{cat.name}</li>
  {/each}
</ul>
```

It's astounding with how many ways one could come up to solve the problem of iterating, but apparently each framework deemed a different way to be best.

### Iterating over objects

```React
Object.entries(a).map(([key, value]) => {
})
// (or Object.keys or Object.values)
```

```Angular
<div *ngFor="let item of myObject | keyvalue">
    Key: <b>{{item.key}}</b> and Value: <b>{{item.value}}</b>
</div>
```

```Vue
<li v-for="(value, name, index) in myObject">
  {{ index }}. {{ name }}: {{ value }}
</li>
```

```Svelte
{#each Object.entries(cats) as [cat_name, cat_number]}
  {cat_name}: {cat_number}
{/each}
```

Note since in none of the frameworks you **have to** use the frameworks specific syntax, you could always just leverage the `Object.entries` or `Object.key` / `Object.values` methods.


### Getting the index

Additionally, one sometimes needs to keep track of the index.

```React
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number, idx) => <li>{number * idx}</li>);
return (
  <ul>{listItems}</ul>
);
```

```Angular
<ul>
  <li *ngFor="let number of numbers; let idx = index">{{number * index}}</li>
</ul>
```

```Vue
<ol>
  <li v-for="(number,index) in numbers">
    {{ number * index }}
  </li>
</ol>
```

```Svelte
<ul>
  {#each cats as cat, i}
    <li>({i}) {cat.name}</li>
  {/each}
</ul>
```

Again, lots of different ways to achieve the same goal in the end.

### Keys: Deciding which DOM elements to keep and which to replace

Imagine this: You have a 100 item long list, and you change something about number 33. Does it make sense to rerender all 100 elements? Probably not. That's why the frameworks have implemented methods to determine which items to keep and which ones to rerender. To do this efficiently it's best to provide the framework with a key, which helps it to identify the elements.

```React
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>    {number}
  </li>
);
```

```Angular
<ul><li *ngFor=”let item of items; trackBy: trackFunction”></li></ul>
...
trackByFunction(idx, item) {
  return item.id;
}
```

```Vue
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

```
{#each things as thing (thing.id)}
	<Thing current={thing.color}/>
{/each}
```

> "The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys. When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort." ReactDocs

Why is that? Because if you use an index, usually too many elements are rerendered unnecessarily. To make an example, when you have 100 items and you introduce a new one at position 50, all other 50 that come afterwards will have `i -> i+1` so they'll be re-rendered.


## Conditional Rendering (If, else if, else, switch)

Another bread and butter ingredient are ways to conditionally render certain parts of the template. Here's how it's done:

```React
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
```

```Angular
<div *ngIf="isLoggedIn; else loggedOut">
  Welcome back, friend.
</div>
<ng-template #loggedOut>
  Please friend, login.
</ng-template>
```

```Vue
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

```Svelte
{#if x > 10}
	<p>{x} is greater than 10</p>
{:else if 5 > x}
	<p>{x} is less than 5</p>
{:else}
	<p>{x} is between 5 and 10</p>
{/if}
```

Again, in React the syntax is obvious since it's just JS. The others each have their own syntax for denoting conditional parts of the template. It is noteworthy, that Angular also has an option to use `*ngSwitch`, which makes cases like the Vue example from above a bit more idiomatic.

## Handling browser events

TODO

## Data binding

In all frameworks you'll find a common goal: Getting data from "JS-Land" to be rendered in "HTML-Land" (the DOM).

TODO


## Change Detection

TODO

## Extracting values from native controls

TODO

## Misc

There are some things I wouldn't consider to be at the core of reactive component based frameworks, however those things pop up often enough to get a "noteworthy mention".

### Directives

Angular, Vue and Svelte all have a concept named "directives". However, the definitions all differ significantly from each other. The common underlying theme seems to be that framework specific stuff which you add to elements which does some framework specific things is called a directive. So for example the `v-if`, `*ngIf` or Svelte's `on:eventname` are called "directives" respectively.

> "Directives are special attributes with the v- prefix. Directive attribute values are expected to be a single JavaScript expression (with the exception of v-for and v-on, which will be discussed later). A directive's job is to reactively apply side effects to the DOM when the value of its expression changes." VueDocs

> "Directives are classes that add additional behavior to elements in your Angular applications. With Angular's built-in directives, you can manage forms, lists, styles, and what users see. The different types of Angular directives are as follows: (1) Components—directives with a template. This type of directive is the most common directive type. (2) Attribute directives—directives that change the appearance or behavior of an element, component, or another directive. (3) Structural directives—directives that change the DOM layout by adding and removing DOM elements." AngularDocs

> "As well as attributes, elements can have directives, which control the element's behaviour in some way." SvelteDocs

## Conclusion

Framework comparisions usually compare what's **different** about the frameworks. However, it can be very worthwhile to examine the commonalities between them! It's also very interesting how some of the concepts the frameworks ended up implementing in a almost identical manner, while others differ radically in their implementation.

Ultimately this article should illustrate to you **how much** it actually is from a conceptual viewpoint which is shared between those frameworks. That's good for you! It means that much of the knowledge you gain when learning one framework can be transferred to others as well, meaning you can pick them up quite easily.

However, this doesn't mean "pick whatever you want, they're all the same". When you'll actually have to choose which one to use for a larger project, you can fall back on a lot of other resources comparing the frameworks **differences**, since then those will become important.

Still, it's fascinating to see just how much of the ideas they've "borrowed" one from another.

<%={{ }}=%>
