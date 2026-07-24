import { PortfolioAIChat } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integraciones",
  description:
    "Conversa con el asistente de IA integrado en el portafolio para conocer a Fidel, su experiencia y sus proyectos.",
};

export default function Integrations() {
  return (
    <div className="mx-auto flex w-full max-w-6xl px-4">
      <PortfolioAIChat />
    </div>
  );
}
