'use client';
import { TypeAnimation } from 'react-type-animation';

export const TypeAnimations = () => {
  return (
    <TypeAnimation
      sequence={['Fidel', 1500, 'Developer', 1500, 'Full-stack', 1500]}
      speed={50}
      repeat={Infinity}
      wrapper='span'
    />
  );
};
