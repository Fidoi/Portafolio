import { getProductByTitle } from '@/actions';
import { SwiperImages, CardsInfo, TitleAnimation } from '@/components';
import { Divider } from '@heroui/react';
import { notFound } from 'next/navigation';

import { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: Promise<{ title: string }>;
}

export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { title } = await params;
  const product = await getProductByTitle(title);

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.mainInfo.commentary ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.mainInfo.commentary ?? '',
      images: [`${product?.mainImage}`],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { title } = await params;
  const project = await getProductByTitle(title);

  if (!project) {
    notFound();
  }

  return (
    <main className='p-8 '>
      <div className='flex justify-center mb-5'>
        <TitleAnimation title={project.title} className='text-6xl' />
      </div>

      <SwiperImages images={project.mainInfo?.urlImages} />
      <Divider className='my-5' />
      <div className='flex justify-center py-5 space-x-4'>
        <CardsInfo
          title={project.title}
          description={project.mainInfo.description}
          links={project.mainInfo.links}
          language={project.mainInfo.technologies}
          commentary={project.mainInfo.commentary}
        />
      </div>
    </main>
  );
}
