'use client';
import { Button, Link } from '@heroui/react';

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
      isExternal
    >
      {text}
    </Button>
  );
};
