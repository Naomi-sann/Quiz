import React, { useEffect, useMemo, useReducer } from "react";

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type AsyncReducer<State, Action> = (
  state: State,
  action: Action
) => { state: State; effects: Array<Lazy<Promise<Array<Action>>>> };

export function useAsyncReducer<State, Action>(
  initialState: State,
  asyncReducer: AsyncReducer<State, Action>
): readonly [State, React.Dispatch<Action>] {
  const memoReducer = useMemo<
    Reducer<
      { state: State; effects: Array<Lazy<Promise<Array<Action>>>> },
      Action
    >
  >(
    () =>
      ({ state }, action: Action) =>
        asyncReducer(state, action),
    [asyncReducer]
  );
  const [{ state, effects }, dispatch] = useReducer(memoReducer, {
    state: initialState,
    effects: [],
  });
  useEffect(() => {
    const runEffects = async () => {
      for (let effect of effects) {
        const actions = await effect();
        for (let action of actions) {
          dispatch(action);
        }
      }
    };
    runEffects();
  }, [effects]);

  return [state, dispatch] as const;
}

export function noEffects<State>(state: State) {
  return { state, effects: [] };
}
