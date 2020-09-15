import React, {CSSProperties, forwardRef} from 'react';

type Props = {
  align?: boolean;
  col?: boolean;
  flex?: number;
  justify?: boolean;
  noFlex?: boolean;
  row?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Box = forwardRef<HTMLDivElement, Props>(({flex, align, col, justify, row, noFlex, ...rest}, ref) => {
  const style: CSSProperties = {display: 'flex', flex: flex ?? (noFlex ? undefined : 1), ...rest.style};
  if (align) {
    style.alignItems = 'center';
  }
  if (col) {
    style.flexDirection = 'column';
  }
  if (row) {
    style.flexDirection = 'row';
  }
  if (justify) {
    style.justifyContent = 'center';
  }
  return <div ref={ref} {...rest} style={style} />;
});
