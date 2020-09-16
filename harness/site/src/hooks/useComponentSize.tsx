import React, {MutableRefObject, useCallback, useLayoutEffect, useState} from 'react';
declare const ResizeObserver: any;

function getSize(el: HTMLElement | null) {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

export function useComponentSize(ref: MutableRefObject<HTMLElement | null>) {
  const _useState = useState(getSize(ref ? ref.current : null));
  const ComponentSize = _useState[0];
  const setComponentSize = _useState[1];

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    handleResize();

    let resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect(ref.current);
      resizeObserver = null;
    };
  }, [ref.current]);

  return ComponentSize;
}
