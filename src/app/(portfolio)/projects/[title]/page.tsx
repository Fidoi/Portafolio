import { getProductByTitle } from '@/actions';
import { SwiperImages, CardsInfo, TitleAnimation } from '@/components';
import { Divider } from '@heroui/react';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ title: string }>;
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
        <TitleAnimation title={project.title} />
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
