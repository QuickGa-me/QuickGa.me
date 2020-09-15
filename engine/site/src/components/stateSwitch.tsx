import React, {ReactElement} from 'react';

type StatusTypes = number | string | symbol;

interface Props<T extends StatusTypes> {
  children: {[key in T]: () => ReactElement<any>};
  state: () => T | undefined;
}

export function StateSwitch<T extends StatusTypes>(props: Props<T>) {
  const state = props.state();
  if (state !== undefined && props.children[state]) {
    return props.children[state]();
  }
  return null;
}
