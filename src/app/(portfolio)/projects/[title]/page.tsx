import { getProductByTitle, getProjects } from "@/actions";
import { SwiperImages, CardsInfo, TitleAnimation } from "@/components";
import { Divider } from "@heroui/react";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ title: string }>;
}

export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title } = await params;
  const product = await getProductByTitle(title);

  return {
    title: product?.title ?? "Titulo no encontrado",
    description: product?.mainInfo.commentary ?? "",
    openGraph: {
      title: product?.title ?? "Titulo no encontrado",
      description: product?.mainInfo.commentary ?? "",
      images: [`${product?.mainImage}`],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { title } = await params;
  const project = await getProductByTitle(title);
  const projects = await getProjects();
  if (!project) {
    notFound();
  }
  const currentIndex = projects.findIndex(
    (p) => p.title.toLowerCase() === title.toLowerCase(),
  );

  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="w-16">
          {previousProject ? (
            <Link
              href={`/projects/${previousProject.title}`}
              aria-label="Proyecto anterior"
              className="inline-flex items-center justify-center rounded-full p-3 bg-primary/20 transition hover:bg-primary-700 "
            >
              <FiArrowLeft className="h-3 w-3 sm:h-7 sm:w-7" />
            </Link>
          ) : null}
        </div>

        <TitleAnimation title={project.title} className="text-6xl" />

        <div className="w-16 flex justify-end">
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.title}`}
              aria-label="Proyecto siguiente"
              className="inline-flex items-center justify-center rounded-full p-3 bg-primary/20 transition hover:bg-primary-700 "
            >
              <FiArrowRight className="h-3 w-3 sm:h-7 sm:w-7" />
            </Link>
          ) : null}
        </div>
      </div>
      <Divider />
      <SwiperImages images={project.mainInfo?.urlImages} />
      <Divider />
      <div className="flex justify-center  space-x-4">
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
