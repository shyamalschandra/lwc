# Architecture Diagrams

The following are a series of flow diagrams describing the internal behavior of Raptor Engine:

## Component Creation

                     Λ                                              Λ
         .─.        ╱ ╲             ┌────────┐                     ╱ ╲            ┌────────┐        ┌────────────────┐
        (   )─────▶▕ 1 ▏─────────┬─▶│ create ├─────┬─────────────▶▕ 2 ▏──────────▶│ render │───────▶│ patch children │
         `─'        ╲ ╱          │  └────────┘     │               ╲ ╱            └────────┘        └────────────────┘
                     V           │                 │                V                                        │
                     │ yes       │                 │                │ yes                                    ▼
                     │           │                 │                │                             ┌────────────────────┐
                     ▼           │                 │                ▼                             │ patch HOST element │
            ┌─────────────────┐  │                 │      ┌───────────────────┐                   └────────────────────┘
            │ getComponentDef │──┘                 │      │ update prop value │                              │
            └─────────────────┘                    │      └───────────────────┘                              ▼
                                                   │                │                         ┌─────────────────────────────┐
                                                   │                │                         │ schedule renderedCallback() │
                                                   │                ▼                         └─────────────────────────────┘
                                                   │                Λ                                        │
                                                   │               ╱ ╲                                       ▼
                                                   ├──────────────▕ 3 ▏                      ┌──────────────────────────────┐
                                                   │               ╲ ╱                       │ schedule connectedCallback() │
                                                   │                V                        └──────────────────────────────┘
                                                   │                │ yes                                    │
                                                   │                │                                        ▼
                                                   │                ▼                                       .─.
                                                   │  ┌──────────────────────────┐                         (   )
                                                   └──│ attributeChangedCallback │                          `─'
                                                      └──────────────────────────┘

*Conditions*:

 * 1 - Is component used for the first time?
 * 2 - Is there any public prop pending to be updated?
 * 3 - Is there an observable attribute corresponding to the updated public prop?

## Schedule Rehydration

                     Λ
         .─.        ╱ ╲ yes    ┌─────────────────┐     ┌────────┐     ┌────────────────┐     ┌────────────────────┐
        (   )─────▶▕ 1 ▏──────▶│ patch component │────▶│ render │────▶│ patch children │────▶│ patch HOST element │
         `─'        ╲ ╱        └─────────────────┘     └────────┘     └────────────────┘     └────────────────────┘
                     V                                                                                  │
                     │                                                                                  │
                     │                                                                                  ▼
                     │                                                                   ┌─────────────────────────────┐
                     │                                                                   │ schedule renderedCallback() │
                     │                                                                   └─────────────────────────────┘
                     │                                                                                  │
                     │                                                                                  ▼
                     │                                                                                 .─.
                     └───────────────────────────────────────────────────────────────────────────────▶(   )
                                                                                                       `─'
*Conditions*:

 * 1 - Is component marked as dirty?


## State Object

                           Λ
        .─.               ╱ ╲                     .─.
       (   )────────────▶▕ 1 ▏──────────────────▶(   )
        `─'               ╲ ╱                     `─'
                           V                       ▲
                           │yes                    │
                           │                       │
                           ▼                       │
                           Λ                       │
                          ╱ ╲                      │
       ┌────────────────▶▕ 2 ▏─────────────────────┘
       │                  ╲ ╱
       │                   V
       │                   │ yes
       │                   ▼
       │     ┌───────────────────────────┐
       │     │ find dependency component │
       │     └───────────────────────────┘
       │                   │
       │                   ▼
       │                   Λ
       │             yes  ╱ ╲
       ├─────────────────▕ 2 ▏
       │                  ╲ ╱
       │                   V
       │                   │
       │                   ▼
       │     ┌──────────────────────────┐
       │     │ mark dependency as dirty │
       │     └──────────────────────────┘
       │                   │
       │                   ▼
       │  ┌─────────────────────────────────┐
       └──│ schedule dependency dehydration │
          └─────────────────────────────────┘

*Conditions*:

 * 1 - Is mutated key marked as reactive?
 * 2 - Is there any component watching for changes in the mutated key?
 * 3 - Is selected dependency component marked as dirty?