import React, {CSSProperties, FC, useCallback, useEffect, useRef, useState} from 'react';
import {Spinner} from '@blueprintjs/core/lib/esm/components/spinner/spinner';
import {observer} from 'mobx-react';

type BoxThemeProps = {theme: 'grey' | 'success' | 'gold' | 'danger' | 'warning'};
type BoxCardBaseProps = {
  elevation: 1 | 2 | 3;
  header?: string;
  innerClassName?: string;
  outerStyle?: CSSProperties;
} & BoxThemeProps;
export type BoxCardProps = BoxCardBaseProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export const BoxCard: FC<BoxCardProps> = observer(
  ({children, outerStyle, elevation, theme, innerClassName, header, ...rest}) => {
    return (
      <div style={outerStyle} className={`box-card box-card-${elevation} ${rest.className || ''} box-${theme}`}>
        {header && (
          <div {...rest} className={`box-card-header`}>
            {header}
          </div>
        )}
        <div {...rest} className={`box-card-inner ${innerClassName || ''}`}>
          {children}
        </div>
      </div>
    );
  }
);

export const BoxCardList: FC<BoxCardProps> = observer(
  ({children, elevation, theme, innerClassName, header, ...rest}) => {
    return (
      <div className={`box-card box-card-${elevation} ${rest.className || ''} box-${theme}`}>
        {header && (
          <div {...rest} className={`box-card-header`}>
            {header}
          </div>
        )}
        <div style={{overflowY: 'scroll', marginBottom: 10}} className={'max-height-60vh'}>
          {React.Children.map(children, (c) => (
            <div {...rest} className={`box-card-inner ${innerClassName || ''}`} style={{padding: 10}}>
              {c}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export const BoxSquare: FC<
  BoxThemeProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = observer(({children, theme, className, ...rest}) => {
  return (
    <div {...rest} className={`box-square box-${theme} ${className}`}>
      {children}
    </div>
  );
});

export type ButtonBoxCardProps = Omit<BoxCardBaseProps, 'elevation'> & {loading?: boolean} & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
export const BoxCardButton: FC<ButtonBoxCardProps> = observer(
  ({onClick, className, theme, loading, disabled, ...rest}) => {
    const [elevation, setElevation] = useState<1 | 2 | 3>(3);
    const [size, setSize] = useState<{height: number; width: number} | undefined>(undefined);
    const onMouseDown = useCallback(() => {
      if (disabled) return;
      setElevation(1);
    }, [disabled]);
    const onMouseUp = useCallback(() => {
      if (disabled) return;
      setElevation(3);
      if (onClick) {
        // AudioService.click();
        onClick(undefined as any);
      }
    }, [disabled, onClick]);

    const [showLoading, setShowLoading] = useState(loading);

    const ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      if (loading) {
        if (ref.current) {
          setSize({
            width: ref.current.offsetWidth + 1,
            height: ref.current.offsetHeight + 1,
          });
          setShowLoading(true);
        }
      } else {
        setSize(undefined);
        setShowLoading(false);
      }
    }, [loading]);

    return (
      <button
        ref={ref}
        {...rest}
        disabled={disabled || showLoading}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        className={`box-card box-card-${elevation} box-card-button box-${theme} ${
          disabled ? 'box-card-disabled' : ''
        } ${className || ''} `}
        style={{...rest.style, ...size, cursor: disabled ? 'not-allowed' : 'pointer'}}
      >
        {showLoading ? <Spinner size={(size?.height || 20) * 0.5} /> : rest.children}
      </button>
    );
  }
);
export const ButtonBoxCardSmall: FC<ButtonBoxCardProps> = observer(
  ({onClick, style, theme, loading, disabled, ...rest}) => {
    const [elevation, setElevation] = useState<1 | 2 | 3>(2);
    const [size, setSize] = useState<{height: number; width: number} | undefined>(undefined);
    const onMouseDown = useCallback(() => {
      if (disabled) return;
      setElevation(1);
    }, [disabled]);
    const onMouseUp = useCallback(() => {
      if (disabled) return;
      setElevation(2);
      onClick && onClick(undefined as any);
    }, [disabled, onClick]);

    const ref = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
      if (ref.current) {
        /*setSize({
        width: Math.max(size?.width || 0, ref.current.offsetWidth + 1),
        height: Math.max(size?.height || 0, ref.current.offsetHeight + 1),
      })*/
      }
    }, [ref.current]);

    return (
      <button
        ref={ref}
        {...rest}
        disabled={disabled || loading}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        className={`box-card box-card-${elevation} box-card-button ${
          rest.className || ''
        }  box-${theme} box-card-small ${disabled ? 'box-card-disabled' : ''}`}
        style={{...style, ...size, cursor: disabled ? 'not-allowed' : 'pointer'}}
      >
        {loading ? <Spinner size={20} /> : rest.children}
      </button>
    );
  }
);
