import {
  trigger,
  transition,
  style,
  animate,
  query,
  animateChild,
} from "@angular/animations";

export const routeAnimations = trigger("routeAnimations", [
  transition("RecipesPage <=> ShoppinglistPage", [
    // query(":enter", animateChild()),
    query(":enter", [
      style({ position: "absolute", width: "97.5%", opacity: 0 }),
      animate("300ms ease-in-out", style({ opacity: 1 })),
    ]),
  ]),
  transition("* => RecipeDetailPage", [
    query(":enter", [
      animateChild(),
      style({
        position: "absolute",
        width: "97.5%",
        opacity: 0,
        transform: "translateX(-400px)",
      }),
      animate(
        "300ms ease-in-out",
        style({ opacity: 1, transform: "translateX(0)" })
      ),
    ]),
  ]),
]);

// export const routeAnimations = trigger("routeAnimations", [
//   transition("RecipesPage <=> ShoppinglistPage", [
//     query(":enter", animateChild()),
//     style({ opacity: 0, transform: "translateX(-100px)" }),
//     animate(
//       "200ms ease-in-out",
//       style({ transform: "translateX(0)", opacity: 1 })
//     ),
//   ]),
// ]);

// transition("* => *", [
//   query(
//     ":enter",
//     style({
//       opacity: 0,
//       transform: "translateX(-100px)",
//     }),
//     { optional: true }
//   ),
//   query(
//     ":enter",
//     stagger("300ms", [
//       animate(
//         "1s ease-in",
//         style({ transform: "translateX(0)", opacity: 1 })
//       ),
//     ])
//   ),
// ]),

// query(":enter", [
//   style({
//     position: "static",
//     // top: "*",
//     // right: "*",
//     // bottom: "*",
//     // left: "*",
//     // width: "100%",
//   }),
// ]),

// style({ position: "relative" }),
// query(":enter", [style({opacity: 1 })]),
// query(":leave", animateChild()),
// group([
// query(":leave", [animate("100ms ease-in-out", style({ opacity: 0 }))]),
// ]),
// query(":enter", animateChild()),

// export const fadeIn =
//   trigger("routeAnimations", [
//     transition("RecipesPage <=> ShoppinglistPage", [
//       style({
//         opacity: 0,
//       }),
//       query(":enter, :leave", [
//         animate(
//           "2s",
//           style({
//             opacity: 1,
//           })
//         ),
//       ]),
//     ]),
//   ]);

// export const routeAnimations =
//   trigger("routeAnimations", [
//     state("RecipesPage", style({ opacity: 1 })),
//     state("ShoppinglistPage", style({ opacity: 1 })),
//     transition("RecipesPage <=> ShoppinglistPage", [
//       animate("300ms ease-in-out", style({ opacity: 0 }))
//     ]),
//   ]);

// transition(":leave", [
//     animate(1000, style({
//         opacity: 0
//     }))
// ])

// export const slideInAnimation =
// trigger('routeAnimations', [
//   transition('HomePage <=> AboutPage', [
//     style({ position: 'relative' }),
//     query(':enter, :leave', [
//       style({
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%'
//       })
//     ]),
//     query(':enter', [
//       style({ left: '-100%'})
//     ]),
//     query(':leave', animateChild()),
//     group([
//       query(':leave', [
//         animate('300ms ease-out', style({ left: '100%'}))
//       ]),
//       query(':enter', [
//         animate('300ms ease-out', style({ left: '0%'}))
//       ])
//     ]),
//     query(':enter', animateChild()),
//   ]),
//   transition('* <=> FilterPage', [
//     style({ position: 'relative' }),
//     query(':enter, :leave', [
//       style({
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%'
//       })
//     ]),
//     query(':enter', [
//       style({ left: '-100%'})
//     ]),
//     query(':leave', animateChild()),
//     group([
//       query(':leave', [
//         animate('200ms ease-out', style({ left: '100%'}))
//       ]),
//       query(':enter', [
//         animate('300ms ease-out', style({ left: '0%'}))
//       ])
//     ]),
//     query(':enter', animateChild()),
//   ])
// ]);
