import {
  ButtonDownload,
  Chart,
  ImageManager,
  TypeAnimations,
} from '@/components';
import Link from 'next/link';

export default function Portfolio() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-12 gap-5'>
      <div className='col-span-8 place-self-center sm:text-left justify-self-start text-center '>
        <h1 className='mb-4 text-4xl sm:text-6xl lg:text-8xl font-semibold tracking-tight inline'>
          <span className='text-transparen bg-clip-text'>Hola soy </span>
          <br></br>

          <TypeAnimations />
        </h1>
        <p className='text-lg lg:text-2xl mt-5'>
          Soy un desarrollador fullstack con 1 año y medio de experiencia en
          Next.js. He trabajado en varios proyectos personales, creando y
          consumiendo APIs, lo que me ha permitido fortalecer mis habilidades en
          el desarrollo web de extremo a extremo.<br></br> Revisa mis proyectos!
        </p>
        <div className='mt-5'>
          <Link
            href='/contact'
            className='rounded-full px-6 py-3 mr-4 text-white bg-primary shadow-lg shadow-primary'
          >
            Contacta
          </Link>
          <ButtonDownload
            url={
              'https://firebasestorage.googleapis.com/v0/b/desarrollo-5753a.appspot.com/o/CV.pdf?alt=media&token=135decf7-35c9-474d-ad39-300f44d8884c'
            }
            text={'Descargar CV'}
          />
        </div>
        <div className='flex md:items-start mt-6 sm:items-center sm:justify-center'>
          <Chart />
        </div>
      </div>
      <div className='col-span-4 justify-center items-center '>
        <ImageManager />
        <h1 className='flex items-center justify-center'>
          <em>
            Mis hobbies son dibujar, hacer ejercicio y jugar <br></br>Nota: Este
            lo hice con el mouse 😈
          </em>
        </h1>
      </div>
    </div>
  );
}
