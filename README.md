# NgSignalsDemo

| Requirement                                | Where to Look                                                                                                                                                                | Key Code / Notes                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Signal Inputs / Outputs**                | `src/app/products/product-selection/quantity-control/quantity-control.ts`                                                                                                    | `value = input.required<number>();` <br> `valueChange = output<number>();`      |
| **Writable Signals**                       | `product.service.ts` → `selectedProduct` <br> `review.service.ts` → `reviews` <br> `product-selection.ts` → `useLazyMode`, `quantity`                                        | Core app state stored in signals                                                |
| **Computed Signals**                       | `product-selection.ts` → `total`, `lazyTotal`, `selectedTotal`, `color` <br> `review-list.ts` → `highestHelpfulCount`                                                        | Derived values recomputed automatically                                         |
| **Linked Signals**                         | `product-selection.ts`                                                                                                                                                       | `quantity = linkedSignal({ source: this.productService.selectedProduct, ... })` |
| **Effects**                                | `product-selection.ts` → `qtyEffect` <br> `review.service.ts` → `syncReviewsEffect`, `logLoadingReviewsEffect` <br> `review-list.ts` → `_focusFirst`                         | Demonstrates side effects reacting to signals                                   |
| **Lazy Evaluation**                        | `product-selection.html` → “Use lazy evaluation” checkbox <br> `product-selection.ts` → `lazyTotal`, `selectedTotal`                                                         | `lazyTotal` computed only when needed                                           |
| **ViewChild / ContentChild (Signals API)** | `review-list.ts` → `rows = viewChildren(ReviewListItem)` <br> `review-list-item.ts` → `helpBtn = viewChild(...)`, `mostHelpfulTpl = contentChild(TemplateRef)`               | Shows DOM and template projection with signals                                  |
| **Optimized Rendering**                    | `app.config.ts` → `provideZonelessChangeDetection()` <br> `review.service.ts` → `voteHelpful(id)` (immutable update) <br> `review-list.html` → `@for (...; track review.id)` | Only the updated review row re-renders                                          |
| **HTTP Resource / Resource API**           | `product.service.ts` → `productsResource` <br> `review.service.ts` → `reviewsResource`, `syncReviewsEffect`                                                                  | Async data via `httpResource`                                                   |
| **RxJS Integration Showcase**              | `review-list.ts` → `filterTitle`, `debouncedTitle`, `filteredReviews` <br> `review-list.html` → filter input + clear button + “No reviews match” row                         | Signal → Observable (debounce) → Signal                                         |

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
