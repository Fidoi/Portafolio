"use client";

import React from "react";
import type { TextAreaProps } from "@heroui/react";
import { Textarea } from "@heroui/react";

type Props = TextAreaProps & {
  classNames?: Record<string, string>;
};

export const PromptInput = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ classNames = {}, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        aria-label="Prompt"
        className="min-h-[40px]"
        classNames={{
          ...classNames,
          label: "hidden",
          input: "py-0",
        }}
        minRows={1}
        placeholder="Escribe tu pregunta..."
        radius="lg"
        variant="bordered"
        {...props}
      />
    );
  },
);

PromptInput.displayName = "PromptInput";
