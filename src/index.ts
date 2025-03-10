import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createObservable, createStore, type ObservableState } from 'create-tiny-store';

const useSafeEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const useStateWrapper = <S, A>(stateBuilder: () => ObservableState<S> & A, noEmitChanges = false) => {
  const [{ state }, setState] = useState(() => ({ state: stateBuilder() }));

  useSafeEffect(
    () => state.subscribe(() => !noEmitChanges && setState((oldState) => ({ ...oldState }))),
    [noEmitChanges],
  );

  return state;
};

/**
 * A hook to create a store with state and custom actions, allowing reactive state management.
 *
 * @param store - The initial state of the store or a factory function to produce the initial state.
 * @param actions - A function that defines actions bound to the provided state.
 * @param [noEmitChanges=false] - A flag indicating whether changes to the state should be emitted.
 *
 * @returns A combined object containing the observable state and bound actions.
 */
export function useStore<
  S extends Record<string, any>,
  A extends Record<string, Function>,
>(
  store: S | (() => S),
  actions: (state: ObservableState<S>) => A,
  noEmitChanges = false,
): ObservableState<S> & A {
  return useStateWrapper(() => createStore(store, actions), noEmitChanges);
}

/**
 * A custom hook that creates and manages an observable state.
 *
 * @param initialValue - The initial state or a factory function to produce the initial state.
 * @param [noEmitChanges=false] - A flag indicating whether changes to the state should be emitted.
 * @returns The observable state.
 */
export function useObservable<T>(initialValue: T | (() => T), noEmitChanges = false): ObservableState<T> {
  return useStateWrapper(() => createObservable(initialValue), noEmitChanges);
}

/**
 * Hook to subscribe to an observable state and retrieve its value.
 * This allows component to reactively listen to changes in the observable state.
 *
 * @param observable - The observable state object to subscribe to.
 * @param [getter] - Optional function to derive a value from the state.
 * Defaults to a function that returns the current state as is.
 * @returns The current derived value of the observable state.
 */
export function useValue<S, V = S>(
  observable: ObservableState<S>,
  getter: ((state: S) => V) = ((state) => state as unknown as V),
): V {
  const [value, setValue] = useState(() => getter(observable.get()));
  const scope = Object.assign(useRef({}).current, { getter });

  useSafeEffect(
    () => observable.subscribe((value) => setValue(scope.getter(value))),
    [observable],
  );

  return value;
}
