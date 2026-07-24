"use client";
import React, { useEffect, useState } from "react";
import { Input, Textarea, Link, Card } from "@heroui/react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { RowSteps } from "../ui/row-steps";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
import { FiMail } from "react-icons/fi";
import { siteConfig } from "@/config/site";

const Button = dynamic(
  () => import("@heroui/react").then((mod) => mod.Button),
  { ssr: false },
);

type Status = "idle" | "loading" | "success" | "error";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const EmailForm = () => {
  const router = useRouter();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
    company: "", // honeypot (los humanos no lo ven ni lo rellenan)
  });

  const fieldsFilled =
    formData.name.trim() !== "" && formData.message.trim() !== "";
  const isFormValid = isValidEmail(formData.email) && fieldsFilled;

  // currentStep se deriva del estado en cada render (sin efectos que muten
  // estado, que era el anti-patrón anterior).
  const currentStep = status === "success" ? 3 : isFormValid ? 2 : 1;

  useEffect(() => {
    if (status === "success") {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex === 0) router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          message: formData.message,
          company: formData.company,
        }),
      });

      if (response.ok) {
        setStatus("success");
        return;
      }

      const data = await response.json().catch(() => null);
      setErrorMsg(
        data?.error ?? "No se pudo enviar el mensaje. Inténtalo más tarde.",
      );
      setStatus("error");
    } catch {
      setErrorMsg("Error de red. Revisa tu conexión e inténtalo de nuevo.");
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <RowSteps
        color={currentStep === 3 ? "success" : "primary"}
        currentStep={currentStep}
        defaultStep={0}
        className="flex flex-col sm:flex-row md:ml-14 sm:ml-0"
        onStepChange={handleStepChange}
        steps={[{ title: "Inicio" }, { title: "Formulado" }, { title: "Enviado" }]}
      />

      <Card
        className="relative my-12 flex flex-col gap-4 bg-opacity-95 px-3 py-10 sm:flex-row md:max-h-[450px] md:max-w-[900px]"
        id="contact"
      >
        <div className="flex flex-col items-center justify-center gap-5">
          <h2 className="text-xl font-bold text-primary">Mantén el contacto</h2>
          <p className="max-w-md">
            En búsqueda de nuevas oportunidades y siempre con la bandeja de
            entrada abierta. Si tienes alguna pregunta o solo quieres saludar,
            ¡haré lo posible por responderte!
          </p>
          <div className="flex flex-row items-center gap-4">
            <Link
              href={siteConfig.links.github}
              color="primary"
              isExternal
              aria-label="GitHub de Fidel Alarcón"
              className="flex flex-col items-center gap-2"
            >
              <GitHubIcon className="h-8 w-8" />
            </Link>

            <Link
              href={`mailto:${siteConfig.contact.email}`}
              color="primary"
              className="flex items-center gap-2"
            >
              <FiMail />
              <span>{siteConfig.contact.email}</span>
            </Link>
          </div>
        </div>

        <div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-shrink gap-5">
              <Input
                isRequired
                name="email"
                type="email"
                label="Email"
                placeholder="tucorreo@ejemplo.com"
                className="max-w-xs"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                isRequired
                name="name"
                type="text"
                label="Nombre"
                placeholder="Juanito Pérez"
                className="max-w-xs"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <Textarea
              isRequired
              name="message"
              label="Mensaje"
              placeholder="Ingresa tu mensaje"
              description="Escribe acá tu mensaje"
              value={formData.message}
              onChange={handleInputChange}
            />

            {/* Honeypot anti-spam: oculto para usuarios reales. */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            {status === "loading" ? (
              <Button color="secondary" isLoading>
                Enviando...
              </Button>
            ) : status === "success" ? (
              <Button color="success" variant="shadow">
                ¡Enviado!
              </Button>
            ) : (
              <Button
                type="submit"
                className="px-5 py-2.5"
                color="primary"
                isDisabled={!isFormValid}
              >
                Enviar mensaje
              </Button>
            )}

            {status === "error" ? (
              <p className="text-sm text-danger" role="alert">
                {errorMsg}
              </p>
            ) : null}
          </form>
        </div>
      </Card>
    </div>
  );
};
