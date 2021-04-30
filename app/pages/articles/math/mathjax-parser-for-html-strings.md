Mathjax is great for rendering math on the web. You can simply choose delimiters for inline- and display-math and then start inputing some html mixed with mathjax-delimited stuff, and mathjax will render it for you. For example:

```
<p>Here's some math: $\frac a b = c$</p>
```

(assuming `$…$` is your inline-math-delimiter)


This could be great, for example if you have a page where users need to input mathematics that should be rendered nicely. Ok, now let’s say you want to store this html to your database. You could either just store `<p>Here's some math: $\frac a b = c$</p>` OR you could want to map it to some kind of internal format, for example an xml scheme, like so:

```
<paragraph> Here's some math: <math>\frac a b = c</math></paragraph>
```

(you might want to do this to have a proper and flexible internal data format for your database)

Then you’d need to parse the math. In this example you’d have to detect `$…$` and map it to `<math>…</math>`. Now the million dollar question is: How can I parse mathjax?! (and yes, regex is a bad idea). This article documents the thoughts behind a mathjax parser. For the final result check out the links at the bottom for the full and working code.

## Parsing Mathjax from a HTML String

I’ll assume here a **basic familiarity with the DOM** and the concept of DOM-nodes. If you don’t have any clue what the DOM is, it’s going to be hard for you to follow. In any case, you could still get the resulting Mathjax-Parser, just scroll down and include the full parser into your codebase. For everyone interested in a deeper understanding of the parser, read on.

Now first of all, let’s examine the rules, when mathjax actually renders something and when not. From the docs:

> There cannot be HTML tags within the math delimiters (other than <br>) as TeX-formatted math does not include HTML tags

So this means, that the example from above would get rendered, while `<p> $ hello <strong> world </strong>$ </p>` would NOT BE RENDERED by mathjax.

So what does this rule mean, in order for parsing mathjax? It means, we need to find (here it comes):

> ALL ADJACENT TEXT AND BR NODES

An example:

```
<p> $Hello <br> world$, isn't it a sunny <strong> day <br> today? </strong> Cool beans. </p>
```

Here there are **three sets** of adjacent text-and-br nodes. Those are the bits of the html that could contain mathjax. Now how do we find those nodes? If you’ve ever been in touch with a DOM-parser, you probably know that it’s quite easy to write a walker that iterates over all nodes. A simple dom walker would process the nodes above in the following order:


1. `<p>`
2. `$Hello (text-node)`
3. `<br>`
4. `world$, isn’t it a sunny (text-node)`
5. `<strong>`
6. `day <br> today? (text-node)`
7. `Cool beans. (text-node)`

Now the problem is, that you can easily process individual nodes, but operating on a **set of nodes** is a bit harder. But we’ll have to find the successions of text-or-br nodes, since that’s where the mathjax could be! Without further a-don’t, here’s the code that does this (most of the code following is at least partially in typescript):

```
private findAdjacentTextOrBrNodes = (nodeList: NodeList): MyRange<number>[] => {
  //value true if node is textOrBr, false otherwise
  //example:
  // hello <br> world <span>bla</span>
  // would yield
  // [true, true, true, false]
  let textOrBrNodes: boolean[] = [];
  for (let i: number = 0; i < nodeList.length; i++) {
    let node: Node = nodeList[i];
    this.isTextOrBrNode(node) ? textOrBrNodes.push(true) : textOrBrNodes.push(false);
  }

  //get array with ranges (arrays) of adjacentTextOrBrNodes
  //example:
  // hello <br> world <span>bla</span> that's cool
  // would yield
  // [{start: 0, end: 3},{start: 4, end: 5}]
  let adjacentTextOrBrNodes: MyRange<number>[] = [];
  for (let i: number = 0; i < textOrBrNodes.length; i++) {
    let isTextOrBrNode: boolean = textOrBrNodes[i];

    if (isTextOrBrNode) {

      //handle case if IS NOT ADJACENT MATCH: insert new array
      if (adjacentTextOrBrNodes.length === 0 ||
          adjacentTextOrBrNodes[adjacentTextOrBrNodes.length - 1].end !== i
      ) {

        adjacentTextOrBrNodes.push({
          start: i,
          end: i+1
        });
      }
      //handle case if IS ADJACENT MATCH: raise value by one
      else if (adjacentTextOrBrNodes[adjacentTextOrBrNodes.length - 1].end === i) {
        ++adjacentTextOrBrNodes[adjacentTextOrBrNodes.length - 1].end;
      }

    }
  }
  return adjacentTextOrBrNodes;
};

interface MyRange<T> {
  start: T;
  end: T;
}
```

Here are the cornerstones explained:

- `findAdjacentTextOrBrNodes`: our elaborate method name.
- `MyRange<number>[]`: return type of the method. For the above example, this would be the expected outcome when running this method on the p node:

```
[{start: 0, end: 3}, {start: 4, end: 5}]
```

- nodeList: NodeList: A node list that should INCLUDING TEXT NODES. More on that later.
- The rest is basically just an iteration over all children producing the output described above. Again, the idea is to get a list of all **adjacent text-or-br nodes**.


Once we have this method, we can build on it. We can write a processor, again for a node**List**, that fetches the  AdjacentTextOrBrNodes, processes the mathjax, and then recursively does the same again for all child Nodes.

```
private processNodeList = (nodeList: NodeList) => {
  let allAdjacentTextOrBrNodes: MyRange<number>[] = this.findAdjacentTextOrBrNodes(nodeList);

  allAdjacentTextOrBrNodes.forEach((textOrBrNodeSet: MyRange<number>) => {
    //processMath
  });

  //process children
  for (let i: number = 0; i < nodeList.length; i++) {
    let node: Node = nodeList[i];
    this.processNodeList(node.childNodes);
  }

};
```

How exactly the math is processed would largely be a repetition of the implementation details of the parser and is thus omitted here. However, one thing to point out here: I called node.childNodes and not node.children since the latter does not contain text nodes! And those are very key to our endeavour to parse mathjax. Also for the initial bootstrapping of the processNodeList, childNodes is called like so:

```
//create a DOM element in order to use the DOM-Walker
let body: HTMLElement = document.createElement('body');
body.innerHTML = inputHtml;

this.processNodeList(body.childNodes);
```

The implementation details of processMath a bit complicated, the easiest thing at this point would be to just get the code (see below) and check it out. Here we’ll just discuss a few more points that were important for the building process.

## “processEscapes”: true

When using the `$` delimiters, mathjax provides a process escape option, such that `\$` isn’t counted as the start of mathjax. In any case `\$` is **never** counted as the end of mathjax in TeX mode, processEscape enabled or not. The mathjax parser has to handle this special case.

## Mathjax Parsing Rules

Understanding how exactly the parser processes text-or-br nodes is crucial to write it correctly.  With the following settings

```
"inlineMath": [["\(","\)"],
 "displayMath": [["\[","\]"]]
```

let’s illustrate this with an example.

```
Example: This \[hello \(world\).
```

INSERT ME

As you can see it’s not rendered at all. So what you’ll have to do in the parser is **scan** all text-or-br nodes **“left to right“**, and as soon as you find an opening delimiter, ignore everything else and try to find the closing delimiter.

This also means that in the following example, the math-inside-the-math will not be rendered:

```
Example: Hello \[ Wo \(rld\) \].
```

INSERT ME

## Ordering the delimiters

For example, if you have the start-delimiters `$$` for display-math, and `$` for inline-math, you’ll have to scan for `$$` first such that the parsing works correctly. More generally the rule goes like this for all delimiters:

> If start-delimiter A contains start-delimiter B, then you must first scan for A and only afterwards for B.


## Final Result

Here are the final results:

Github: [Mathjax-Parser](https://github.com/bersling/mathjax-parser)

Directly install with NPM

```
npm install --save mathjax-parser
```

And a pic of what the parser could do, here transforming the delimiters of the inline math and block math.

