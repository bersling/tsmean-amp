{{=<% %>=}}


Picking the right frontend framework isn't an easy task in 2021. Yet, however you have decided, there are concepts that are present in all frameworks. The concepts just might have a different name and implementation.

The big four currently are React, Angular, Vue and Svelte. Most articles compare what's **different** about them and makes each one unique. However, for a developer it's also interesting to know what are the basic concepts that are common to all of them. What's the true core of a component centric frontend framework? Those are the things that are most valuable for developers to understand, since they'll always be around, even after switching frameworks.

The code snippets **are not meant to start a framework war** about which one is shorter or which one you prefer more. It's just a means of illustrating the different implementations of the common concepts.

So let's dive into it and have a look at what those frameworks all have in common.


# Table of Contents
- [Components](#components)
    - [Selectors](#selectors)
    - [Local state](#local-state)
    - [Inferred properties](#inferred-properties)
    - [Passing data into a child component (props)](#passing-data-into-a-child-component-props)
    - [Child to parent communication](#child-to-parent-communication)
    - [Lifecycle Hooks](#lifecycle-hooks)
- [Templates](#templates)
    - [Data binding](#data-binding)
    - [Interpolation](#interpolation)
        - [XSS Protection and opting out](#xss-protection-and-opting-out)
    - [Lists](#lists)
        - [Iterating over Objects](#iterating-over-objects)
        - [Getting the Index](#getting-the-index)
        - [Keys: Deciding which DOM elements to keep and which to replace](#keys-deciding-which-dom-elements-to-keep-and-which-to-replace)
    - [Conditional Rendering (if, else if, else, switch)](#conditional-rendering-if-else-if-else-switch)
    - [Content Projection / Slots](#content-projection--slots)
- [Extracting values from native controls](#extracting-values-from-native-controls)
- [Handling DOM events](#handling-dom-events)
- [Misc](#misc)
    - [State Management and Stores](#state-management-and-stores)
    - [Server-Side Rendering (SSR)](#server-side-rendering-ssr)    
    - [Directives](#directives)
    

And finally there is a short [conclusion](#conclusion).

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

An alternative in vue are the single file components:
```Vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: red;
}
</style>
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
- Vue lets you call a method on the `Vue` global object, but you can also register components locally.
- Svelte encapsulates logic (js), structure (html) and style (css) in `.svelte` files. Much like in React, in Svelte there's also filetype dedicated to hold the components.

Another interesting point to observe is, that React is the only framework here that doesn't come with a baked in solution for scoped css.

### Selectors
There needs to be a way of referencing a component in other components in order to include them and build the tree structure that we want. To do so, each component must receive a unique name. The frameworks have different ways of specifying that name.

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

- The way of declaring the name of a component is quite different, with Angular and Vue letting the component itself determine its name whereas React leans towards the component being named when importing (even though usually the name will be determined by the filename or class name).
- The way of using the components is quite similar, the difference being that Angular and Vue use the `<bla></bla>` syntax where React and Svelte opt for the `<Bla/>` syntax.


### Local state
All frameworks enable components to have **local state**, meaning that a component itself holds (and mutates) the state:

```React
class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Hello World'
    };
  }
}
```

```Angular
export class MyComponent {
  x = 5;
}
```

```Vue
<script>
export default {
  data() {
    return {
      msglocal: 'Hellooo'
    }
  }
}
</script>
```

```Svelte
<script>
	let x = 5;
</script>
```

### Inferred Properties

Often you'll want to do some sorts of modification to some data without actually modifying the data itself. For example, you get a and b as input, so it's actual data, but you want to display the sum of those to the user.

```React
class SomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 6, b: 6
    }
  }

  sum() {
    return this.state.a + this.state.b;
  }

  render() {
    return (
      <span>
        {this.sum()}
      </span>
    );
  }
}
```

```Angular
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular' + VERSION.major;
  get uppercaseName() {
    return this.name.toUpperCase();
  }
}
```

In Vue the concept is called ["Computed Properties"](https://v3.vuejs.org/guide/computed.html#computed-properties)
```Vue
<template>
  <h1>{{ uppercaseName }}</h1>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  computed: {
    uppercaseName() {
      return this.msg.toUpperCase();
    }
  }
}
</script>
```

Svelte again has a different name for this concept in store, they call it ["Reactive Declarations"](https://svelte.dev/tutorial/reactive-declarations).
```Svelte
<script>
	let count = 0;
	$: doubled = count * 2;

	function handleClick() {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<p>{count} doubled is {doubled}</p>
```

There's actually a little more to this topic than meets the eye at first sight. It is important to familiarize yourself with **when** those inferred properties are being calculated, in order to make sure you're not calculating things unnecessarily. Since this is framework dependent, we'll not dive into that here.


### Passing data into a child component (props)

Another common feature amongst the dominating frameworks is that they allow data to be passed into components. This is often called "props" of a component, since it specifies the properties that it has. I think params would also have been a good name, since it's the way in which a component can be parameterized.

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

The HTML is usually called `template` instead of `HTML`. Why is that so? Well, because it isn't directly rendered into the DOM as-is. Rather it is a template for the HTML that will later be produced. The term stems from templating engines in general, where you have a `templating engine` that takes `template + data` and spits out `some output`, in our case what finally gets rendered to the DOM.

Again, even though the concept is there for all the frameworks, the syntax varies drastically. It doesn't make too much sense to compare "a minimal template", since those would all look like `<h1>Hello world</h1>`. The difference how templating works will become more apparent as we see other common concepts and how they differ. We can however make some general remarks about the templates for each framework.

- React has a unique approach for templates among those frameworks. The difference is that the other frameworks define their own templating language, whereas React tries to use JavaScript to get jobs like iterating or conditionals done.
- Angular has its own templating syntax with things like `*ngIf` or `*ngFor`.
- Vue hast its own templating syntax with things like `v-if` and `v-for`.
- Svelte has its own templating syntax with things like `{#if}` and `{#each}`.

Within the templates, there are also a lot of common concepts that each framework has its own syntax for. We'll cover those next.

## Data binding

In all frameworks you'll find a common goal: Getting data from "JS-Land" to be rendered in "HTML-Land" (the DOM). This technique is commonly known as "data binding". To cite wikipedia:

> "In computer programming, data binding is a general technique that binds data sources from the provider and consumer together and synchronizes them" ~[Wiki](https://en.wikipedia.org/wiki/Data_binding)

I wasn't really sure where to put this section at first, it would also be a good fit for the "Reactivity" section. But I thought it would be good to introduce the concept here, since it is the basic underlying concept for templates and it's also in the templates where the developers usually get in touch with the concept. This is because you'll often have a piece of data, for example the data in an input field, and then you'll need to ask yourself "ok, now how can I **bind** to this"? How can I retrieve its value? Or you have a some local state you want to reflect in the template, e.g. a user object with "user.firstName" and "user.lastName". But how can you display it in the template? You'll have to find a way to **bind** it to the template. Binding then means that the framework will do the work for you of keeping it in sync. Basically all of the following parts in the templating section can be seen as "data binding" of some sorts.

### Interpolation

> "Text interpolation allows you to incorporate dynamic string values into your HTML templates" ~AngularDocs

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

### Lists

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

#### Iterating over objects

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


#### Getting the index

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

#### Keys: Deciding which DOM elements to keep and which to replace

Imagine this: You have a 100 item long list, and you change something about number 33. Does it make sense to re-render all 100 elements? Probably not. That's why the frameworks have implemented methods to determine which items to keep and which ones to re-render. To do this efficiently it's best to provide the framework with a key, which helps it to identify the elements.

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

```Svelte
{#each things as thing (thing.id)}
	<Thing current={thing.color}/>
{/each}
```

> "The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys. When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort." ~ReactDocs

Why is that? Because if you use an index, usually too many elements are rerendered unnecessarily. To make an example, when you have 100 items and you introduce a new one at position 50, all other 50 that come afterwards will have `i -> i+1` so they'll be re-rendered.


### Conditional Rendering (if, else if, else, switch)

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

Again, in React the syntax is obvious since it's just JS. The others each have their own syntax for denoting conditional parts of the template. It is noteworthy, that Angular also has an option to use `*ngSwitch`, which makes cases like the Vue example from above a bit more elegant.


### Content Projection / Slots
There is a need for components to exhibit "frame-like" behaviour, such that the component acts as a frame where you can still put ANY other stuff inside. This is where slots come into play. The easy and more commonly used type is with exactly one slot, so exactly like in the image frame analogy. You could also think of a more complicated frame with more than one slot which the frameworks also support, but let's stick with one slotted examples here.

```React
const Wrap = ({ children }) => <div>{children}</div>

export default () => <Wrap><h1>Hello word</h1></Wrap>
```

```Angular
@Component({
  selector: 'my-frame',
  template: `
    <div>Top</div>
    <ng-content></ng-content>
    <div>Bottom</div>
  `
})

<my-frame>
  projectedcontent here
</my-frame>
```

```Vue
<!-- todo-button component template -->
<button class="btn-primary">
  <slot></slot>
</button>
...
<todo-button>
  Add todo
</todo-button>
```

```Svelte
<div class="box">
	<slot></slot>
</div>
...
<Box>
	<h2>Hello!</h2>
	<p>This is a box. It can contain anything.</p>
</Box>
```

## Handling DOM events

TODO

## Extracting values from native controls

TODO

## Reactivity and Change Detection

Apart from enabling you to separate your app into individual building blocks, there's a second main benefit that the component driven libraries bring to you and that is reactivity. What does that mean?

It means that you don't need to update the DOM yourself, you should be more concerned with updating the data and once this is done the framework takes over and updates the DOM **for you**. So the system **reacts** to changes in your data and updates the DOM accordingly.

The next interesting question is: How does the framework know that your data has changed? That's where **Change Detection** is coming into play. There are different ideas here among the frameworks how this should be detected. Some are based on the idea that you, the developer, simply tell it when some data has changed and the DOM should be updated. Others try to figure that out for you by themselves.

```React
// you tell React explicitly
// that you changed something by calling the setState method.
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

```Angular
// you update local variable values,
// then change detection sets in
x = x + 1
```

```Vue
<script>
export default {
  data() {
    return {
      msglocal: 'Hellooo'
    }
  },
  methods: {
    reverseText() {
      this.msglocal = this.msglocal.split('').reverse().join('');
    }
  }
}
</script>
```

```Svelte
<script>
	let count = 0;

	function handleClick() {
	    // you change a local variable and reactivity gets triggered
		count += 1;
	}
</script>
```

So the underlying message of this is the following:

- React has opted for the developer explicitly informing it when a state change occurred
- The other frameworks try to detect changes for you instead
- There are subtleties that are not covered here, since we're focusing on the commonalities. However, it is important to know that e.g. Angular and Svelte won't pick up on objects being mutated whereas Vue does this for you. When learning your framework it is important to understand where it requires immutability. For example [Immutability in Svelte](https://svelte.dev/tutorial/updating-arrays-and-objects) or [Immutability in React](https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important).

## Misc

There are some things I wouldn't consider to be at the core of reactive component based frameworks, however those things pop up often enough to get a "noteworthy mention".

### State management and stores

A common problem that component frameworks have to solve is that of state management. We've already touched on state when we've seen that components can have local state. When it comes to sharing state amongst different components, the philosophies and implementations of the frameworks vary.

- In all frameworks you can use a technique called ["lifting state up"](https://reactjs.org/docs/lifting-state-up.html). This refers to moving the state up to the nearest common ancestor in the component hierarchy.
- As an alternative to storing state to components, you might want to delegate the state management to some other entity. For example when you'd need the same state in components very far away from each other it isn't feasible to pass it through all components. In this scenario other state management solutions come into play. They all revolve around the idea that this shared state is stored in a "central" place, a so-called store. This is an entity that is decoupled from the world of components in a sense. It can be seen as a standalone "JavaScript object" that can be imported on demand in the components that need it. While in React it is common to use libraries such as Redux, in Angular and Svelte many developers fall back to baked in solutions such as services and built in stores for Svelte.

### Server-Side Rendering (SSR)

While not being part of the core framework itself, solutions for server-side rendering are present everywhere. However, the quality of the solution differs vastly from framework to framework. I'll not go into more detail here, but I think it's an important common aspect that's worth mentioning.

### Directives

Angular, Vue and Svelte all have a concept named "directives". However, the definitions all differ significantly from each other. The common underlying theme seems to be that framework specific stuff which you add to elements which does some framework specific things is called a directive. So for example the `v-if`, `*ngIf` or Svelte's `on:eventname` are called "directives" respectively.

> "Directives are special attributes with the v- prefix. Directive attribute values are expected to be a single JavaScript expression (with the exception of v-for and v-on, which will be discussed later). A directive's job is to reactively apply side effects to the DOM when the value of its expression changes." ~VueDocs

> "Directives are classes that add additional behavior to elements in your Angular applications. With Angular's built-in directives, you can manage forms, lists, styles, and what users see. The different types of Angular directives are as follows: (1) Components—directives with a template. This type of directive is the most common directive type. (2) Attribute directives—directives that change the appearance or behavior of an element, component, or another directive. (3) Structural directives—directives that change the DOM layout by adding and removing DOM elements." ~AngularDocs

> "As well as attributes, elements can have directives, which control the element's behaviour in some way." ~SvelteDocs

### Data flow

TODO ?



## Conclusion

Framework comparisions usually compare what's **different** about the frameworks. However, it can be very worthwhile to examine the commonalities between them! It's also very interesting how some of the concepts the frameworks ended up implementing in a almost identical manner, while others differ radically in their implementation.

Ultimately this article should illustrate to you **how much** it actually is from a conceptual viewpoint which is shared between those frameworks. That's good for you! It means that much of the knowledge you gain when learning one framework can be transferred to others as well, meaning you can pick them up quite easily.

However, this doesn't mean "pick whatever you want, they're all the same". As we've seen, while many of the underlying concepts are the same, the implementations differ drastically. In addition to that there are also some differences on top, for example that Svelte is just a compiler or that Angular comes with a module system. We've not covered this here, since that was exactly not the point, but when choosing a framework those are the things that you should actually consider. But there are tons of articles on "this framework vs that framework", so you should have a plenthora of options to inform yourself about that.

Still, it's fascinating to see just how much of the ideas they've "borrowed" one from another.

<%={{ }}=%>
