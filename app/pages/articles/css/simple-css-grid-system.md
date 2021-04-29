Who doesn't know the struggle? You need to make your page responsive and you want to do it in an easy way. Bootstrap is what often comes to mind. But is bootstrap really the best solution for this? In 2021, the answer is no.

Why is bootstrap not ideal? Bootstrap has several design flaws. First of all, the way it works with negative margins was maybe the way to go in the days of Internet Explorer, but now this can be done in a much neater way using `css grid`! Furthermore, bootstraps classes don't have any prefix, which can easily produce problems when somebody names their class `.container` or `.row`.

So what's the suggested alternative? The suggested alternative is to either write it yourself, because it is really really easy. In fact, it is so easy I will just post the code here (scss):

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

With SCSS this is really condensed and it produces a beautiful grid system! It could be used like this:

```
<div class="tb-grid">
  <div class="tb-sm-6">
    Item 1
  </div>
  <div class="tb-sm-6">
    Item 2
  </div>
  <div class="tb-sm-4 tb-lg-6">
    Item 3
  </div>
  <div class="tb-sm-8 tb-lg-6">
    Item 4
  </div>
</div>
```

OR you could use the [`tb-grid`](https://github.com/taskbase/tb-grid) library, which is a minimalistic implementation of this idea. It's your decision.

See it in action on Stackblitz:
[https://stackblitz.com/edit/tb-grid?file=src/app/app.component.scss](https://stackblitz.com/edit/tb-grid?file=src/app/app.component.scss)

# Limitations
If you need to support old browsers like internet explorer, this solution is not for you. However, since Microsoft itself abandoned support for IE I'd strongly advise you to try to get rid of IE support yourself. All evergreen browsers have support for CSS grid and you should be fine with those!

# Summary
It is really easy with CSS Grid to create your own minimalistic grid system! No need at all for a library! If you'd still prefer something with some more features, you can go for the actual [`tb-grid`](https://github.com/taskbase/tb-grid) library.
