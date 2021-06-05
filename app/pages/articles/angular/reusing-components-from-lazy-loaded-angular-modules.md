I like the concept of feature modules since it usually nicely encapsulates things. So let's say we have a `PrivacyModule` that contains a component `PrivacyStatementComponent` and a `PrivacyPageComponent`. When going to the privacy page I'd want to lazily load the privacy module since it's not needed everywhere. But when I then also want to use the `PrivacyStatementComponent` in another place (e.g. on the `SignUpPage`) I cannot just import `PrivacyModule` in the `SignupModule` since it has attached to it the routing.

Here's an example of the problem: [https://stackblitz.com/edit/reuse-lazy-loading-fail](https://stackblitz.com/edit/reuse-lazy-loading-fail) .

So what can you do to solve this problem?

It is not **directly** possible to reuse components from lazy loaded modules that are used with `RouterModule.forChild(routes)`. However, there are ways to achieve this reusability.

## Option 1: SharedModule

An often suggested option is to move components that are reused by different modules to a so called `SharedModule`. This shared module is then usually imported in all feature modules.

## Option 2: Make a dedicated module for routing

If you want to preserve the "feature scoping" and not just stuff everything into a shared module, you can make two modules: One that does the routing and a second one that exports the reusable components.

```
PrivacyRoutingModule # Does the lazy loading for `/privacy`
PrivacyModule        # Exports the PrivacyStatementComponent so it can be reused
```

Working example: [https://stackblitz.com/edit/reuse-lazy-loading-success](https://stackblitz.com/edit/reuse-lazy-loading-success)

On the plus side you won't have an ever-growing `SharingModule`, on the other hand you'll start introducing quite a few modules if you always have 2 modules for every lazy loaded route.
