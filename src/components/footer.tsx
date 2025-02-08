import { Divider } from '@heroui/react';
import React from 'react';

export const Footer = () => {
  const currentYear: number = new Date().getFullYear();
  return (
    <footer>
      <Divider />
      <div>
        <p>&copy; {currentYear} Fidoing. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
