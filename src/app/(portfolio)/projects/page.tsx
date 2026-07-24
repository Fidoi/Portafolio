import { getProjects } from "@/actions";
import { Cards, TitleAnimation } from "@/components";
import { slugify } from "@/lib/slug";

import { Divider } from "@heroui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos personales y académicos de Fidel Alarcón: desarrollo fullstack con Next.js, React y TypeScript.",
};

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <TitleAnimation
          as="h1"
          title="Proyectos personales"
          className="text-6xl"
        />
      </div>
      <Divider />

      {projects.length === 0 ? (
        <p className="py-16 text-center text-default-500">
          No hay proyectos para mostrar por ahora.
        </p>
      ) : (
        // Una columna en móvil: a dos columnas las portadas quedan tan
        // pequeñas que no se distingue de qué trata cada proyecto.
        <div className="z-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Cards
              key={project.id}
              title={project.title}
              urlImage={project.mainImage}
              url={`/projects/${slugify(project.title)}`}
              description={project.mainInfo.description}
              liveUrl={project.mainInfo.links?.[0]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
