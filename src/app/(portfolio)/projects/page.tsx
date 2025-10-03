import { getProjects } from "@/actions";
import { Cards, TitleAnimation } from "@/components";

import { Divider } from "@heroui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Portafolio",
};

export default async function Projects() {
  const projects = await getProjects();
  if (!projects) return null;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <TitleAnimation title="Proyectos personales" className="text-6xl" />
      </div>
      <Divider />
      <div className="flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-9 w-full z-10">
          {projects.map((project, index) => (
            <Cards
              key={index}
              title={project.title}
              urlImage={project.mainImage}
              url={project.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
