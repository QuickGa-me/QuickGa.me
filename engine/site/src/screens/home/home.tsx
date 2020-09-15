import './home.scss';
import {FC, ReactNode} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Box} from '../../components/box';
import {Footer} from './components/footer';
import useInView from 'react-cool-inview';

export const Home: FC = observer(() => {
  useEffectAsync(async () => {}, []);

  return (
    <>
      Quick Game!
      <Footer />
    </>
  );
});

export const Section: FC<{children: (inView: boolean) => ReactNode; className?: string}> = ({children, className}) => {
  const {ref, inView} = useInView({
    unobserveOnEnter: true,
  });

  return (
    <Box justify className={`section ${className}`} ref={ref as any}>
      {children(inView)}
    </Box>
  );
};
