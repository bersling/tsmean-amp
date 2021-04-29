Bootstraps grid system is well known throughout the world. 12 columns are quite flexible and you can make your page responsive in no time. However, it has some flaws:

- Its structure require at least three level of nesting: `.container`, `.row` and `.col`. The `.container` is unnecessary.
- Its classes are not scoped. `.container` and `.row` are not that exotic that no-one would ever accidentally use those.

However, you can reverse engineer bootstrap's grid system with less than 100 lines of scss code!

Here is a prototype:

```
$breakpoints: (
  "sm": 600px,
  "md": 800px,
  "lg": 1000px
);

.tb-grid {
  display: grid;
  column-gap: 15px;
  row-gap: 15px;
  grid-template-columns: repeat(12, 1fr);
  > * {
    grid-column-start: span 12;
  }
  @each $breakpoint-name, $breakpoint-value in $breakpoints {
    @media (min-width: #{$breakpoint-value}) {
      @for $i from 1 through 12 {
        .tb-#{$breakpoint-name}-#{$i} {
          grid-column-start: span #{$i};
        }
      }
    }
  }
}
```

This idea can be taken a bit further by working with CSS variables to customize things like breakpoints and gutters!

The full code and a translation to css can be found here:
[tb-grid code](https://github.com/taskbase/tb-grid)

There's also a demo on Stackblitz available here:
[tb-grid on Stackblitz](https://stackblitz.com/edit/tb-grid?file=src/app/app.component.scss)


# Conclusion
With modern css it is dead simple to reverse engineer bootstrap's grid system. Not only that, we also managed to eliminate the need for the extra container and have it nicely scoped under the `tb-` prefix.

