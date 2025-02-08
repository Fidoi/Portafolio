'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from '@heroui/react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import { CiMenuBurger } from 'react-icons/ci';
export const DropDown = () => {
  const pathname = usePathname();

  return (
    <Dropdown backdrop='blur'>
      <NavbarItem>
        <DropdownTrigger>
          <Button disableRipple radius='sm' color='primary'>
            <CiMenuBurger />
            Menu
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu className='w-[340px]'>
        <DropdownItem key='home'>
          <Button
            as={Link}
            color={`${pathname === '/' ? 'primary' : 'default'}`}
            href='/'
            className='flex items-center h-8 text-xl'
            variant='light'
          >
            <FaHome />
            Inicio
          </Button>
        </DropdownItem>
        <DropdownItem key='projects'>
          <Button
            as={Link}
            color={`${pathname === '/projects' ? 'primary' : 'default'}`}
            href='/projects'
            className='flex items-center text-xl'
            variant='light'
          >
            <MdWork />
            Proyectos
          </Button>
        </DropdownItem>
        <DropdownItem key='inte'>
          <Button
            as={Link}
            href='/inte'
            className='flex items-center text-xl'
            variant='light'
            isDisabled
          >
            <AiFillEye />
            Integraciones
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
