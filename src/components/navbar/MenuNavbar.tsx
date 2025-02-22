import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import Link from 'next/link';

import { ImageAudio } from './image/music';
import { ThemeSwitcher } from './ThemeSwitcher';
import { DropDown } from './dropdown/DropDown';
import { TitleAnimation } from '../ui/titles/titleAnimation';

export const MenuNavbar = () => {
  return (
    <Navbar
      isBordered
      maxWidth='full'
      height={'5rem'}
      className='flex justify-between items-center fixed'
    >
      <NavbarContent justify='start'>
        <ImageAudio />
      </NavbarContent>
      <NavbarContent className='sm:hidden' justify='center'>
        <DropDown />
      </NavbarContent>
      <NavbarContent className='hidden sm:flex' justify='center'>
        <NavbarItem>
          <Link color='foreground' href='/'>
            <TitleAnimation title='Inicio' className='text-2xl' />
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link
            color='primary'
            aria-current='page'
            href='/projects'
            className='text-primary'
          >
            <TitleAnimation title='Proyectos' className='text-2xl' />
          </Link>
        </NavbarItem>
        <NavbarItem isActive={false}>
          <Link
            color='foreground'
            href='#'
            className='pointer-events-none cursor-default opacity-50'
          >
            <TitleAnimation title='Integraciones' className='text-2xl' />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
};
