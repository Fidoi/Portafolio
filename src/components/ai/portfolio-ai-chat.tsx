"use client";

import React from "react";
import { Avatar, Button, Link, ScrollShadow } from "@heroui/react";
import { PromptInputWithBottomActions } from "./prompt-input-with-bottom-actions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const urlRegex = /(https?:\/\/[^\s`)\]]+|www\.[^\s`)\]]+)/g;

function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(urlRegex).filter(Boolean);

  return (
    <p className="whitespace-pre-wrap leading-7">
      {parts.map((part, index) => {
        const isUrl = /^https?:\/\//.test(part) || /^www\./.test(part);

        if (!isUrl) {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        }

        const cleanUrl = part.replace(/[`)\]]+$/, "");
        const href = cleanUrl.startsWith("http")
          ? cleanUrl
          : `https://${cleanUrl}`;

        return (
          <Link
            key={index}
            href={href}
            isExternal
            target="_blank"
            rel="noreferrer"
            className="break-all"
            showAnchorIcon
          >
            {cleanUrl}
          </Link>
        );
      })}
    </p>
  );
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "flex max-w-[85%] items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-default-100 text-default-800",
        ].join(" ")}
      >
        {!isUser ? (
          <Avatar size="sm" src="/favicon.ico" className="mt-0.5 shrink-0" />
        ) : null}

        <div className="flex-1">
          <LinkifiedText text={message.content} />
        </div>
      </div>
    </div>
  );
};

export const PortfolioAIChat = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hola, soy el asistente de este portafolio. ¿Qué quieres saber?",
    },
  ]);
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  // El usuario "manda" el scroll: solo autobajamos si ya está cerca del fondo,
  // para no arrancarle la vista mientras lee mensajes anteriores.
  const stickToBottom = React.useRef(true);

  const isNearBottom = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    },
    [],
  );

  const handleScroll = React.useCallback(() => {
    stickToBottom.current = isNearBottom();
  }, [isNearBottom]);

  // Al añadir/crecer mensajes, seguimos el fondo solo si el usuario no subió.
  React.useLayoutEffect(() => {
    if (stickToBottom.current) scrollToBottom("auto");
  }, [messages, scrollToBottom]);

  const sendMessage = React.useCallback(
    async (value?: string) => {
      const text = (value ?? prompt).trim();
      if (!text || loading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      const assistantId = crypto.randomUUID();
      const history = [...messages, userMessage];

      // Pinta el mensaje del usuario y una burbuja vacía del asistente que se
      // irá rellenando conforme llega el stream.
      stickToBottom.current = true;
      setMessages([
        ...history,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setPrompt("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.body) throw new Error("sin cuerpo");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          );
          if (stickToBottom.current) scrollToBottom("auto");
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Uy, algo falló al conectar conmigo 😵 Revisa tu conexión e inténtalo de nuevo.",
                }
              : m,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, prompt, messages, scrollToBottom],
  );

  const quickPrompts = [
    "Cuéntame sobre Fidel y su experiencia",
    "¿Cuántos proyectos tiene este portafolio?",
    "Mencióname un proyecto y explícamelo",
    "Cuéntame más sobre este portafolio",
  ];

  // Las sugerencias son afordancia de arranque: se muestran solo mientras la
  // conversación no ha empezado (únicamente el saludo inicial).
  const showQuickPrompts = messages.length <= 1;
  // La burbuja del asistente en curso está vacía mientras Gemini "piensa".
  const waitingFirstToken =
    loading && messages[messages.length - 1]?.content === "";

  return (
    // Alto = viewport − navbar (5rem). Evita el doble scroll: dentro solo se
    // desplaza la lista de mensajes, no la página.
    <div className="flex h-[calc(100dvh-5rem)] w-full flex-col gap-4 py-4 lg:h-[calc(100dvh-8rem)]">
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar size="lg" src="/favicon.ico" />
        <h1 className="text-xl font-medium text-default-700">
          ¡Explora el portafolio conmigo!
        </h1>
      </div>

      {showQuickPrompts ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickPrompts.map((item) => (
            <Button
              key={item}
              size="sm"
              variant="flat"
              className="h-auto whitespace-normal py-3 text-left"
              onPress={() => sendMessage(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      ) : null}

      <ScrollShadow
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 flex-col gap-3 rounded-2xl border border-default-200 bg-content1 p-4"
        hideScrollBar
        role="log"
        aria-live="polite"
        aria-label="Conversación con el asistente"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {waitingFirstToken ? (
          <div className="flex justify-start" aria-hidden>
            <div className="flex items-center gap-1 rounded-2xl bg-default-100 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-default-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-default-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-default-400" />
            </div>
          </div>
        ) : null}
      </ScrollShadow>

      <div className="flex flex-col gap-2">
        <PromptInputWithBottomActions
          loading={loading}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSend={() => sendMessage()}
        />
        <p className="px-2 text-tiny text-default-400">
          El asistente puede equivocarse. Si algo es importante, revísalo.
        </p>
      </div>
    </div>
  );
};
