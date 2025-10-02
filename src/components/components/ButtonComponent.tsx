"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type ButtonColor =
  | "primary"
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type ButtonVariant =
  | "flat"
  | "ghost"
  | "solid"
  | "bordered"
  | "light"
  | "faded"
  | "shadow";

interface Props {
  children: ReactNode;
  url?: string;
  className?: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
}

export const ButtonComponent = ({
  children,
  url,
  className,
  variant,
  color,
}: Props) => {
  const router = useRouter();

  return (
    <Button
      className={className ?? "rounded-full"}
      size="lg"
      variant={variant ?? "ghost"}
      color={color ?? "primary"}
      onPress={() => url && router.push(url)}
    >
      {children}
    </Button>
  );
};
