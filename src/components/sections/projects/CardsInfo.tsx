'use client';

import React from 'react';
import {
  Card,
  Image,
  CardBody,
  CardHeader,
  Link,
  CardFooter,
} from '@heroui/react';

interface Props {
  title: string;
  description: string;
  links: string[];
  language: string[];
  commentary?: string;
}

export const CardsInfo = ({
  title,
  description,
  links,
  language,
  commentary,
}: Props) => {
  return (
    <Card className='w-full max-w-[750px] '>
      <CardBody className='flex flex-row flex-wrap p-0 sm:flex-nowrap '>
        <Image
          removeWrapper
          alt='Acme Creators'
          className='h-auto w-full flex-none object-cover object-top md:w-48'
          src={language[0]}
        />
        <div className='px-4 py-5'>
          <CardHeader className='flex gap-3'>
            <Image
              alt='heroui logo'
              height={40}
              radius='sm'
              src={language[1]}
              width={40}
            />
            <div className='flex flex-col'>
              <p className='text-lg'>{title}</p>
              <Link isExternal href={links[0]} showAnchorIcon>
                <p className='text-small text-default-500'>{links[0]}</p>
              </Link>
            </div>
          </CardHeader>

          <div className='flex flex-col gap-3 pt-2 text-small text-default-400'>
            <p>{description}</p>
            <p className='italic'>{commentary}</p>
          </div>
          <CardFooter>
            <Link isExternal showAnchorIcon href={links[1]}>
              Revisar codigo en Github.
            </Link>
          </CardFooter>
        </div>
      </CardBody>
    </Card>
  );
};
