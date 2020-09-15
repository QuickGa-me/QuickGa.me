import React, {ReactElement, ReactNode} from 'react';

interface Props<T> {
  cases: {render: () => ReactNode | string; value: T}[];
  value: T;
}

export function Switcher<T>(props: Props<T>) {
  const {cases, value} = props;
  for (const option of cases) {
    if (option.value === value) {
      return option.render();
    }
  }
  return null;
}

interface SwitcherEnumProps<T> {
  cases: {[key in keyof T]: () => ReactElement<{}>};
  forceUniqueKey?: boolean;
  value: keyof T;
}

export function SwitcherEnum<T>(props: SwitcherEnumProps<T>): ReactElement<{}> | undefined {
  const {cases, value} = props;
  if (cases[value]) {
    if (props.forceUniqueKey) {
      return React.cloneElement(cases[value](), {key: value.toString()});
    } else {
      return cases[value]();
    }
  }
  return undefined;
}

interface SwitcherEnumRProps<T> {
  children: {[key in keyof T]: () => ReactElement<{}>};
  forceUniqueKey?: boolean;
  value: keyof T;
}

export function SwitcherEnumR<T>(props: SwitcherEnumRProps<T>): ReactElement<{}> | undefined {
  const {children, value} = props;
  if (children[value]) {
    if (props.forceUniqueKey) {
      return React.cloneElement(children[value](), {key: value.toString()});
    } else {
      return children[value]();
    }
  }
  return undefined;
}
