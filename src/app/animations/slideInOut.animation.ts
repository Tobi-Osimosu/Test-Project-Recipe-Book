import { trigger, transition, style, animate, sequence } from '@angular/animations';

export const slideInOut = trigger("slideInOut", [
    transition(":enter", [
      style({
        opacity: 0,
        transform: "translateX(-100px)",
      }),
      animate("1s ease-in-out", style({ transform: "translateX(0)", opacity: 1 })),
    ]),
    transition(
      ":leave", [
        sequence([
          animate("600ms ease-in-out", style({ backgroundColor: "crimson" })),
          animate(
            "450ms ease-in-out",
            style({ transform: "translateX(100px)", opacity: 0 })
          ),
        ])
      ]
    ),
    transition("* => *", [
      style({
        opacity: 0,
        transform: "translateX(-100px)",
      }),
      animate("1s ease-in-out", style({ transform: "translateX(0)", opacity: 1 })),
    ]),
  ]);