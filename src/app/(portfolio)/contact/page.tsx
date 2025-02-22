import { TitleAnimation } from '@/components';
import { EmailForm } from '@/components/sections/EmailForm';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'contacto por email',
};

export default function Contact() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <TitleAnimation title='Contacto' className='text-6xl' />
      <EmailForm />
    </div>
  );
}
