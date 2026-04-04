"use client";

import React from "react";
import { Avatar, Button, Link, ScrollShadow } from "@heroui/react";
import { getChatResponse } from "@/actions/chat-action";
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

export const TypewriterText = ({
  text,
  onTick,
}: {
  text: string;
  onTick?: () => void;
}) => {
  const [shown, setShown] = React.useState("");

  React.useEffect(() => {
    setShown("");
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      onTick?.();

      if (index >= text.length) window.clearInterval(timer);
    }, 12);

    return () => window.clearInterval(timer);
  }, [text, onTick]);

  return <LinkifiedText text={shown} />;
};

export const MessageBubble = ({
  message,
  onBotTick,
}: {
  message: Message;
  onBotTick?: () => void;
}) => {
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
          {isUser ? (
            <p className="whitespace-pre-wrap leading-7">{message.content}</p>
          ) : (
            <TypewriterText text={message.content} onTick={onBotTick} />
          )}
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
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = scrollRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    },
    [],
  );

  React.useLayoutEffect(() => {
    scrollToBottom("auto");
  }, [messages, scrollToBottom]);

  React.useEffect(() => {
    if (loading) scrollToBottom("smooth");
  }, [loading, scrollToBottom]);

  const sendMessage = React.useCallback(
    async (value?: string) => {
      const text = (value ?? prompt).trim();
      if (!text || loading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };

      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setPrompt("");
      setLoading(true);

      try {
        const response = await getChatResponse(nextMessages);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Error de IA interno.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, prompt, messages],
  );

  const quickPrompts = [
    "Cuéntame sobre Fidel y su experiencia",
    "¿Cuántos proyectos tiene este portafolio?",
    "Mencióname un proyecto y explícamelo",
    "Cuéntame más sobre este portafolio",
  ];

  return (
    <div className="flex h-dvh w-full flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-2 pt-4">
        <Avatar size="lg" src="/favicon.ico" />
        <h1 className="text-xl font-medium text-default-700">
          ¡Explora el portafolio conmigo!
        </h1>
      </div>

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

      <ScrollShadow
        ref={scrollRef}
        className="flex flex-1 flex-col gap-3 rounded-2xl border border-default-200 bg-content1 p-4"
        hideScrollBar
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onBotTick={scrollToBottom}
          />
        ))}

        {loading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-default-100 px-4 py-3 text-sm text-default-500">
              Escribiendo...
            </div>
          </div>
        ) : null}
      </ScrollShadow>

      <div className="flex flex-col gap-3">
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
