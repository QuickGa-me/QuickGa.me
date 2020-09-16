import React, {ReactElement} from 'react';

interface Props<T extends number | string | symbol> {
  children: {[key in T]: () => ReactElement<any>};
  state: T;
}

export function StatusSwitch<T extends number | string | symbol>(props: Props<T>) {
  const state = props.state;
  return props.children[state]();
}
