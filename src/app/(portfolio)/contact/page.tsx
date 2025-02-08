import { TitleAnimation } from '@/components';
import { EmailForm } from '@/components/sections/EmailForm';

export default function Contact() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <TitleAnimation title='Contacto' />
      <EmailForm />
    </div>
  );
}
