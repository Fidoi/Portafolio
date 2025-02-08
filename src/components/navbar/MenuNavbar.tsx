import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import Link from 'next/link';

import { ImageAudio } from './image/music';
import { ThemeSwitcher } from './ThemeSwitcher';

export const MenuNavbar = () => {
  return (
    <nav>
      <Navbar
        isBordered
        maxWidth='full'
        height={'5rem'}
        className='flex justify-between items-center fixed'
      >
        <NavbarContent>
          <ImageAudio />
        </NavbarContent>
        <NavbarContent className='hidden sm:flex gap-4' justify='center'>
          <NavbarItem>
            <Link color='foreground' href='/'>
              Inicio
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              color='primary'
              aria-current='page'
              href='/projects'
              className='text-primary'
            >
              Proyectos
            </Link>
          </NavbarItem>
          <NavbarItem isActive={false}>
            <Link
              color='foreground'
              href='#'
              className='pointer-events-none cursor-default opacity-50'
            >
              Integraciones
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
          <NavbarItem className='hidden lg:flex'></NavbarItem>
        </NavbarContent>
        <ThemeSwitcher />
      </Navbar>
    </nav>
  );
};
