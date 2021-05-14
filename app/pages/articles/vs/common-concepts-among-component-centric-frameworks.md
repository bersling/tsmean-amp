{{=<% %>=}}

Picking the right frontend framework isn't an easy task in 2021. Yet, however you have decided, there are concepts that are present in all frameworks. The concepts just might have a different name.

The big four currently seem to be React, Angular, Vue and Svelte. Most articles compare what's **different** about them and makes each one unique. However, for a developer it's also interesting to know what are the basic concepts that are common to all of them. What's the true core of a component centric frontend framework? Those are the things that are most valuable for developers to understand, since they'll always be around, even after switching frameworks.

Since all frameworks have those concepts, I'll sometimes just copy some sentences from one of the docs pages since it doesn't make sense to rewrite all of that from scratch.

So let's dive into it and have a look at what those frameworks have all in common.

## Components

The most obvious thing is components, since the whole article revolves around the component centric frameworks. Components are great since they allow you to compose your application of reusable and testable building blocks, and who wouldn't want that. So basically all modern frontend applications are built around a component centric model.

What is a component exactly? A component is a unit that encapsulates things. All frameworks encapsulate HTML and JS/TS. Some of them also encapsulate CSS. The basic syntax for defining a component differs for the frameworks.

```React
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
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

## Templates

The HTML is usually called `template` instead of `HTML`. Why is that so? Well, because it isn't directly rendered into the DOM as-is. Rather it is a template for the HTML that will later be produced. The term stems from templating engines in general (see here: https://en.wikipedia.org/wiki/Template_processor), where you have a `templating engine` that takes `template + data` and spits out `some output`, in our case what finally gets rendered to the DOM.

Again, even though the concept is there for all the frameworks, the syntax varies drastically. It doesn't make too much sense to compare "a minimal template", since those would all look like `<h1>Hello world</h1>`. The difference how templating works will become more apparent as we see other common concepts and how they differ. We can however make some general remarks about the templates for each framework.

- React has a unique approach for templates among those frameworks. The difference is that the other frameworks define their own templating language, whereas React tries to use JavaScript concepts to get jobs like iterating over arrays done.
- Angular has its own templating syntax with things like `*ngIf` or `*ngFor`
- Vue hast its own templating syntax with things like `v-if` and `v-for`
- Svelte has its own templating syntax with things like `{{#if}}` and `{{#each}}`

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

<%={{ }}=%>
