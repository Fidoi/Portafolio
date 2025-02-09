import { ButtonDownload, ImageManager, TypeAnimations } from '@/components';
import Link from 'next/link';

export default function portfolio() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-12 '>
      <div className='col-span-8 place-self-center sm:text-left justify-self-start text-center '>
        <h1 className='mb-4 text-4xl sm:text-6xl lg:text-8xl font-semibold tracking-tight inline'>
          <span className='text-transparen bg-clip-text'>Hola soy {''}</span>
          <br></br>

          <TypeAnimations />
        </h1>
        <p className='text-lg lg:text-xl mt-5'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem
          exercitationem, deleniti dolorum inventore pariatur facere
          necessitatibus molestiae non sapiente nesciunt error in nobis unde
          numquam possimus harum mollitia ad perspiciatis?
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
              'https://firebasestorage.googleapis.com/v0/b/desarrollo-5753a.appspot.com/o/CV.pdf?alt=media&token=55f5ff6f-1972-4751-b46f-03fbfb29a487'
            }
            text={'Descargar CV'}
          />
        </div>
      </div>
      <div className='col-span-4 justify-self-end '>
        <ImageManager />
      </div>
    </div>
  );
}
