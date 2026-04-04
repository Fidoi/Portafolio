"use client";

import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PromptInput } from "./prompt-input";

type Props = {
  prompt: string;
  loading: boolean;
  onPromptChange: (value: string) => void;
  onSend: () => void;
};

export const PromptInputWithBottomActions = ({
  prompt,
  loading,
  onPromptChange,
  onSend,
}: Props) => {
  return (
    <form
      className="flex w-full flex-col items-start rounded-2xl bg-default-100 transition-colors hover:bg-default-200/70"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <PromptInput
        classNames={{
          inputWrapper: "bg-transparent shadow-none",
          innerWrapper: "relative",
          input: "pl-2 pr-10! pb-6 pt-1 text-medium",
        }}
        endContent={
          <Tooltip showArrow content="Send message">
            <Button
              isIconOnly
              color={!prompt.trim() ? "default" : "primary"}
              isDisabled={!prompt.trim() || loading}
              radius="lg"
              size="sm"
              type="submit"
              variant="solid"
            >
              <Icon
                className={
                  !prompt.trim()
                    ? "text-default-600"
                    : "text-primary-foreground"
                }
                icon="solar:arrow-up-linear"
                width={20}
              />
            </Button>
          </Tooltip>
        }
        minRows={3}
        radius="lg"
        value={prompt}
        variant="flat"
        onValueChange={onPromptChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
    </form>
  );
};
