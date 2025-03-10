# Use Tiny Store

A super tiny React hook collection to use with `create-tiny-store`.

For more info about `create-tiny-store` check the [NPM](https://www.npmjs.com/package/create-tiny-store).

## Features
- 🚀 Does not trigger re-render unnecessarily
- 📦 Small collection of simple hooks
- 🔒 Uses **TypeScript** by default
- 🔄 **Debounced** state by default

## Quick links

Observable
- [createObservable](#create-observable)
- [Listen for observable changes](#listen-for-observable-changes)
- [Modify observable value](#modify-observable-value)

Store
- [createStore](#create-store)
- [Listen for store changes](#listen-for-store-changes)
- [Modify store value](#modify-store-value)
- [Advanced store example](#advanced-store-example)

&nbsp;\
&nbsp;\
&nbsp;

## Available hooks

- `store`: store state object or init function
- `actions`: object with callbacks that will manipulate the store state
- `noEmitChanges`: if true it will not trigger re-render
```typescript
useStore( store, actions, noEmitChanges = false )
```

- `initialValue`: value or init function
- `noEmitChanges`: if true it will not trigger re-render
```typescript
useObservable( initialValue, noEmitChanges = false )
```

- `observable`: store or value observable created via `createStore` or `createObservable`
- `getter`: function to get a specific value from observable state
```typescript
useValue( observable, getter )
```

&nbsp;\
&nbsp;\
&nbsp;

## Using global observable
`useValue( observable )`

```typescript jsx
const globalCount$ = createObservable(0);

function Count() {
  const count = useValue(globalCount$);
  return <span>{count}</span>;
}

function GlobalObservableCounter() {
  return (
    <div>
      <button onClick={() => globalCount$.set(Math.random())}>Randomize</button>
      <span>...</span>
      <button onClick={() => globalCount$.set(state => (state - 1))}>-</button>
      <Count />
      <button onClick={() => globalCount$.set(state => (state + 1))}>+</button>
    </div>
  );
}
```

&nbsp;\
&nbsp;\
&nbsp;

## Using global store
`useValue( observable, getter )`

```typescript jsx
const globalStore$ = createStore(
  // () => ({ count: 0 }),
  { count: 0 },

  ({ set }) => ({
    randomize: () => set({ count: Math.random() }),
    decrease: () => set(state => ({ count: state.count - 1 })),
    increase: () => set(state => ({ count: state.count + 1 })),
  }),
);

function Count() {
  const count = useValue(globalStore$, (state) => state.count);
  return <span>{count}</span>;
}

function GlobalStoreCounter() {
  return (
    <div>
      <button onClick={globalStore$.randomize}>Randomize</button>
      <span>...</span>
      <button onClick={globalStore$.decrease}>-</button>
      <Count />
      <button onClick={globalStore$.increase}>+</button>
    </div>
  );
}
```

&nbsp;\
&nbsp;\
&nbsp;

## Using local observable
`useObservable( valueOrValueInitFunction, noEmitChanges = false )`

```typescript jsx
function Count({ count }) {
  return <span>{count}</span>;
}

function LocalObservableCounter() {
  // const count$ = useObservable(() => 0);
  const count$ = useObservable(0);

  return (
    <div>
      <button onClick={() => count$.set(Math.random())}>Randomize</button>
      <span>...</span>
      <button onClick={() => count$.set(state => (state - 1))}>-</button>
      <Count count={count$.get()} />
      <button onClick={() => count$.set(state => (state + 1))}>+</button>
    </div>
  );
}
```

## Using local observable (optimized)
`useObservable( valueOrValueInitFunction, noEmitChanges )`\
`useValue( observable )`

```typescript jsx
function Count({ count$ }) {
  const count = useValue(count$);
  return <span>{count}</span>;
}

function LocalObservableCounter() {
  // const count$ = useObservable(() => 0);
  const count$ = useObservable(0, true);

  return (
    <div>
      <button onClick={() => count$.set(Math.random())}>Randomize</button>
      <span>...</span>
      <button onClick={() => count$.set(state => (state - 1))}>-</button>
      <Count count$={count$} />
      <button onClick={() => count$.set(state => (state + 1))}>+</button>
    </div>
  );
}
```

&nbsp;\
&nbsp;\
&nbsp;

## Using local store
`useStore( storeOrStoreInitFunction, actionsInitFunction, noEmitChanges = false )`

```typescript jsx
function Count({ count }) {
  return <span>{count}</span>;
}

function LocalStoreCounter() {
  const localStore$ = useStore(
    // () => ({ count: 0 }),
    { count: 0 },

    ({ set }) => ({
      randomize: () => set({ count: Math.random() }),
      decrease: () => set(state => ({ count: state.count - 1 })),
      increase: () => set(state => ({ count: state.count + 1 })),
    }),
  );

  return (
    <div>
      <button onClick={localStore$.randomize}>Randomize</button>
      <span>...</span>
      <button onClick={localStore$.decrease}>-</button>
      <Count count={localStore$.get().count} />
      <button onClick={localStore$.increase}>+</button>
    </div>
  );
}
```

## Using local store (optimized) - useStore + useValue
`useStore( storeOrStoreInitFunction, actionsInitFunction, noEmitChanges )`\
`useValue( observable, getter )`

```typescript jsx
function Count({ store$ }) {
  const count = useValue(store$, state => state.count);
  return <span>{count}</span>;
}

function LocalStoreCounter() {
  const localStore$ = useStore(
    // () => ({ count: 0 }),
    { count: 0 },

    ({ set }) => ({
      randomize: () => set({ count: Math.random() }),
      decrease: () => set(state => ({ count: state.count - 1 })),
      increase: () => set(state => ({ count: state.count + 1 })),
    }),

    true,
  );

  return (
    <div>
      <button onClick={localStore$.randomize}>Randomize</button>
      <span>...</span>
      <button onClick={localStore$.decrease}>-</button>
      <Count store$={localStore$} />
      <button onClick={localStore$.increase}>+</button>
    </div>
  );
}
```

&nbsp;\
&nbsp;\
&nbsp;

### For more examples for `create-tiny-store` usage check the [NPM](https://www.npmjs.com/package/create-tiny-store).
