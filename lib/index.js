import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createObservable, createStore } from 'create-tiny-store';
const useSafeEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const useStateWrapper = (stateBuilder, noEmitChanges = false) => {
    const [{ state }, setState] = useState(() => ({ state: stateBuilder() }));
    useSafeEffect(() => state.subscribe(() => !noEmitChanges && setState((oldState) => ({ ...oldState }))), [noEmitChanges]);
    return state;
};
export function useStore(store, actions, noEmitChanges = false) {
    return useStateWrapper(() => createStore(store, actions), noEmitChanges);
}
export function useObservable(initialValue, noEmitChanges = false) {
    return useStateWrapper(() => createObservable(initialValue), noEmitChanges);
}
export function useValue(observable, getter = ((state) => state)) {
    const [value, setValue] = useState(() => getter(observable.get()));
    const scope = Object.assign(useRef({}).current, { getter });
    useSafeEffect(() => observable.subscribe((value) => setValue(scope.getter(value))), [observable]);
    return value;
}
