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

export function useObservable<T>(initialValue: T | (() => T), noEmitChanges = false): ObservableState<T> {
  return useStateWrapper(() => createObservable(initialValue), noEmitChanges);
}

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
