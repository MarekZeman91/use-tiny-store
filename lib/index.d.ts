import { type ObservableState } from 'create-tiny-store';
export declare function useStore<S extends Record<string, any>, A extends Record<string, Function>>(store: S | (() => S), actions: (state: ObservableState<S>) => A, noEmitChanges?: boolean): ObservableState<S> & A;
export declare function useObservable<T>(initialValue: T | (() => T), noEmitChanges?: boolean): ObservableState<T>;
export declare function useValue<S, V = S>(observable: ObservableState<S>, getter?: ((state: S) => V)): V;
