import { getProductBySlug, getProjects } from "@/actions";
import { ProjectShowcase, ProjectNav } from "@/components";
import { notFound } from "next/navigation";
import { slugify } from "@/lib/slug";

import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: Promise<{ title: string }>;
}

export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title: slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Proyecto no encontrado" };
  }

  return {
    title: product.title,
    description: product.mainInfo.commentary || product.mainInfo.description,
    openGraph: {
      title: product.title,
      description: product.mainInfo.commentary || product.mainInfo.description,
      images: product.mainImage ? [product.mainImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { title: slug } = await params;
  const project = await getProductBySlug(slug);
  const projects = await getProjects();

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex(
    (p) => slugify(p.title) === slugify(slug),
  );

  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  const screenshots =
    project.mainInfo?.urlImages?.length > 0
      ? project.mainInfo.urlImages
      : project.mainImage
        ? [project.mainImage]
        : [];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <ProjectNav
        previous={
          previousProject
            ? {
                title: previousProject.title,
                href: `/projects/${slugify(previousProject.title)}`,
                image: previousProject.mainImage,
              }
            : null
        }
        next={
          nextProject
            ? {
                title: nextProject.title,
                href: `/projects/${slugify(nextProject.title)}`,
                image: nextProject.mainImage,
              }
            : null
        }
      />

      <ProjectShowcase
        title={project.title}
        description={project.mainInfo.description}
        commentary={project.mainInfo.commentary}
        links={project.mainInfo.links}
        referenceImages={project.mainInfo.technologies}
        screenshots={screenshots}
      />
    </div>
  );
}
