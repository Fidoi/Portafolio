'use client';
import { Button } from '@heroui/react';
import Link from 'next/link';

interface Props {
  text?: string;
  url: string;
}

export const ButtonDownload = ({ text, url }: Props) => {
  return (
    <Button
      className='rounded-full'
      variant='ghost'
      color='secondary'
      as={Link}
      href={url}
    >
      {text}
    </Button>
  );
};
