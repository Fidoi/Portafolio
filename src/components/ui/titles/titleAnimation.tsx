'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  title: string;
}

export const TitleAnimation = ({ title }: Props) => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 }, // Comienza arriba
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' } // Baja suavemente
    );
  }, []);

  return (
    <h1 ref={titleRef} className='text-6xl font-bold'>
      {title}
    </h1>
  );
};
