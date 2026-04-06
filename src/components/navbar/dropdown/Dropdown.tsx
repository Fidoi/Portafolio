"use client";

import React, {
  cloneElement,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export type DropdownPlacement =
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "top"
  | "top start"
  | "top end";

export type DropdownSelectionMode = "none" | "single" | "multiple";
export type DropdownSelection = Set<React.Key> | "all";
export type DropdownBackdrop = false | "transparent" | "blur" | "solid";
export type DropdownColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
export type DropdownTriggerVariant = "solid" | "flat" | "ghost" | "bordered";

type RootProps = {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: DropdownPlacement;
  offset?: number;
  backdrop?: DropdownBackdrop;
  className?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
};

type TriggerProps = {
  children: ReactNode;
  className?: string;
  color?: DropdownColor;
  variant?: DropdownTriggerVariant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

type MenuProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  color?: DropdownColor;
  selectionMode?: DropdownSelectionMode;
  selectedKeys?: Iterable<React.Key> | DropdownSelection;
  defaultSelectedKeys?: Iterable<React.Key> | DropdownSelection;
  onSelectionChange?: (keys: Set<React.Key>) => void;
  onAction?: (key: React.Key) => void;
  closeOnSelect?: boolean;
  maxHeight?: number | string;
  disabledKeys?: Iterable<React.Key>;
};

type ItemProps = {
  children: ReactNode;
  id?: React.Key;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  variant?: "default" | "danger";
  disabled?: boolean;
  description?: ReactNode;
  shortcut?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
  textValue?: string;
  isSelected?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

type SectionProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

type RootCtx = {
  open: boolean;
  mounted: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  placement: DropdownPlacement;
  offset: number;
  backdrop: DropdownBackdrop;
  disabled?: boolean;
  closeOnSelect: boolean;
  idBase: string;
};

type MenuCtx = {
  selectionMode: DropdownSelectionMode;
  selectedKeys: Set<React.Key>;
  disabledKeys: Set<React.Key>;
  onAction?: (key: React.Key) => void;
  closeOnSelect: boolean;
  setOpen: (open: boolean) => void;
  toggleSelection: (key: React.Key) => void;
  color: DropdownColor;
};

const RootContext = createContext<RootCtx | null>(null);
const MenuContext = createContext<MenuCtx | null>(null);
const EXIT_MS = 160;

function useRoot() {
  const ctx = useContext(RootContext);
  if (!ctx)
    throw new Error("Dropdown components must be used inside <Dropdown />");
  return ctx;
}

function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx)
    throw new Error("Dropdown.Item must be used inside <Dropdown.Menu />");
  return ctx;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

function normalizeSelection(
  input: Iterable<React.Key> | DropdownSelection | undefined,
) {
  if (!input) return new Set<React.Key>();
  if (input === "all") return new Set<React.Key>(["all"]);
  return new Set(input);
}

function colorButtonClasses(
  color: DropdownColor,
  variant: DropdownTriggerVariant,
) {
  const base = "transition-colors";

  if (variant === "ghost") {
    switch (color) {
      case "primary":
        return cn(base, "bg-transparent text-primary hover:bg-primary/10");
      case "secondary":
        return cn(base, "bg-transparent text-secondary hover:bg-secondary/10");
      case "success":
        return cn(base, "bg-transparent text-success hover:bg-success/10");
      case "warning":
        return cn(base, "bg-transparent text-warning hover:bg-warning/10");
      case "danger":
        return cn(base, "bg-transparent text-danger hover:bg-danger/10");
      default:
        return cn(base, "bg-transparent text-foreground hover:bg-foreground/5");
    }
  }

  if (variant === "bordered") {
    switch (color) {
      case "primary":
        return cn(
          base,
          "border border-divider bg-background text-primary hover:bg-primary/10",
        );
      case "secondary":
        return cn(
          base,
          "border border-divider bg-background text-secondary hover:bg-secondary/10",
        );
      case "success":
        return cn(
          base,
          "border border-divider bg-background text-success hover:bg-success/10",
        );
      case "warning":
        return cn(
          base,
          "border border-divider bg-background text-warning hover:bg-warning/10",
        );
      case "danger":
        return cn(
          base,
          "border border-divider bg-background text-danger hover:bg-danger/10",
        );
      default:
        return cn(
          base,
          "border border-divider bg-background text-foreground hover:bg-foreground/5",
        );
    }
  }

  if (variant === "flat") {
    switch (color) {
      case "primary":
        return cn(base, "bg-primary/10 text-primary hover:bg-primary/15");
      case "secondary":
        return cn(base, "bg-secondary/10 text-secondary hover:bg-secondary/15");
      case "success":
        return cn(base, "bg-success/10 text-success hover:bg-success/15");
      case "warning":
        return cn(base, "bg-warning/10 text-warning hover:bg-warning/15");
      case "danger":
        return cn(base, "bg-danger/10 text-danger hover:bg-danger/15");
      default:
        return cn(
          base,
          "bg-foreground/5 text-foreground hover:bg-foreground/10",
        );
    }
  }

  switch (color) {
    case "primary":
      return cn(base, "bg-primary text-primary-foreground hover:opacity-90");
    case "secondary":
      return cn(
        base,
        "bg-secondary text-secondary-foreground hover:opacity-90",
      );
    case "success":
      return cn(base, "bg-success text-success-foreground hover:opacity-90");
    case "warning":
      return cn(base, "bg-warning text-warning-foreground hover:opacity-90");
    case "danger":
      return cn(base, "bg-danger text-danger-foreground hover:opacity-90");
    default:
      return cn(
        base,
        "bg-background text-foreground border border-divider hover:bg-foreground/5",
      );
  }
}

function iconButtonClasses() {
  return "inline-flex items-center justify-center gap-2 rounded-xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4.5 10.5L8.2 14L15.5 6.75"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const state = controlled ? (value as T) : internal;

  const setState = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  return [state, setState] as const;
}

function getMenuPosition(
  triggerEl: HTMLElement,
  menuEl: HTMLElement,
  placement: DropdownPlacement,
  offset: number,
) {
  const triggerRect = triggerEl.getBoundingClientRect();
  const menuRect = menuEl.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const gap = 8;

  const prefersTop = placement.startsWith("top");
  const prefersBottom = placement.startsWith("bottom");
  const alignEnd = placement.endsWith("end");
  const alignStart =
    placement.endsWith("start") ||
    placement === "top" ||
    placement === "bottom";

  const spaceBelow = viewportH - triggerRect.bottom - offset - gap;
  const spaceAbove = triggerRect.top - offset - gap;
  const openAbove =
    prefersTop ||
    (!prefersBottom && spaceBelow < menuRect.height && spaceAbove > spaceBelow);

  let top = openAbove
    ? triggerRect.top - menuRect.height - offset
    : triggerRect.bottom + offset;
  let left = 0;

  if (alignEnd) left = triggerRect.right - menuRect.width;
  else if (alignStart) left = triggerRect.left;
  else left = triggerRect.left + triggerRect.width / 2 - menuRect.width / 2;

  left = Math.max(gap, Math.min(left, viewportW - menuRect.width - gap));
  top = Math.max(gap, Math.min(top, viewportH - menuRect.height - gap));

  return {
    top: Math.round(top),
    left: Math.round(left),
    minWidth: Math.round(triggerRect.width),
    openAbove,
  };
}

function DropdownRoot({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom start",
  offset = 8,
  backdrop = false,
  className,
  disabled,
  closeOnSelect = true,
}: RootProps) {
  const [open, setOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [mounted, setMounted] = useState(defaultOpen || Boolean(isOpen));
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const idBase = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
      return;
    }

    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const ctx = useMemo<RootCtx>(
    () => ({
      open,
      mounted,
      setOpen,
      triggerRef,
      menuRef,
      placement,
      offset,
      backdrop,
      disabled,
      closeOnSelect,
      idBase,
    }),
    [
      open,
      mounted,
      placement,
      offset,
      backdrop,
      disabled,
      closeOnSelect,
      idBase,
    ],
  );

  return (
    <RootContext.Provider value={ctx}>
      <div className={cn("flex w-full", className)}>{children}</div>
    </RootContext.Provider>
  );
}

function DropdownTrigger({
  children,
  className,
  color = "primary",
  variant = "solid",
  size = "md",
  fullWidth = false,
}: TriggerProps) {
  const { open, setOpen, disabled, triggerRef } = useRoot();

  const sizeClasses =
    size === "sm"
      ? "h-8 px-3 text-sm"
      : size === "lg"
        ? "h-11 px-4 text-base"
        : "h-9 px-3.5 text-sm";

  const appearance = colorButtonClasses(color, variant);

  const triggerClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium outline-none",
    sizeClasses,
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed",
  );

  const openMenu = () => {
    if (!disabled) setOpen(!open);
  };

  if (isValidElement(children)) {
    const child = children as ReactElement<any>;
    const isButtonLike =
      typeof child.type === "string" &&
      (child.type === "button" || child.type === "a");

    return cloneElement(child, {
      ref: composeRefs(triggerRef as React.Ref<HTMLElement>),
      "aria-haspopup": "menu" as const,
      "aria-expanded": open,
      onClick: openMenu,
      className: cn(
        (child.props as any).className,
        !isButtonLike && triggerClassName,
        isButtonLike && "p-0 bg-transparent border-none",
        className,
      ),
    });
  }

  return (
    <button
      ref={composeRefs(triggerRef as React.Ref<HTMLButtonElement>)}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={openMenu}
      className={cn(triggerClassName, className)}
    >
      {children}
    </button>
  );
}

function DropdownMenu({
  children,
  className,
  ariaLabel,
  color = "primary",
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  onAction,
  closeOnSelect = true,
  maxHeight = 320,
  disabledKeys,
}: MenuProps) {
  const {
    open,
    mounted,
    setOpen,
    triggerRef,
    menuRef,
    placement,
    offset,
    backdrop,
  } = useRoot();
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    minWidth: number;
    openAbove: boolean;
  } | null>(null);
  const [internalSelection, setInternalSelection] = useControllableState({
    value: selectedKeys ? normalizeSelection(selectedKeys) : undefined,
    defaultValue: normalizeSelection(defaultSelectedKeys),
    onChange: onSelectionChange,
  });
  const disabledSet = useMemo(
    () => new Set(disabledKeys ?? []),
    [disabledKeys],
  );

  const toggleSelection = useCallback(
    (key: React.Key) => {
      if (selectionMode === "none") return;
      const next = new Set(internalSelection);
      if (selectionMode === "single") {
        next.clear();
        next.add(key);
      } else {
        if (next.has(key)) next.delete(key);
        else next.add(key);
      }
      setInternalSelection(next);
    },
    [internalSelection, selectionMode, setInternalSelection],
  );

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl || !menuEl) return;
    setPosition(getMenuPosition(triggerEl, menuEl, placement, offset));
  }, [placement, offset, triggerRef, menuRef]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const frame = window.requestAnimationFrame(updatePosition);
    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [mounted, updatePosition]);

  useEffect(() => {
    if (!mounted) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        (triggerRef.current as HTMLElement | null)?.focus?.();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, setOpen, triggerRef, menuRef]);

  const menuCtx = useMemo<MenuCtx>(
    () => ({
      selectionMode,
      selectedKeys: internalSelection,
      disabledKeys: disabledSet,
      onAction,
      closeOnSelect,
      setOpen,
      toggleSelection,
      color,
    }),
    [
      selectionMode,
      internalSelection,
      disabledSet,
      onAction,
      closeOnSelect,
      setOpen,
      toggleSelection,
      color,
    ],
  );

  if (!mounted) return null;

  const overlay =
    backdrop === "blur" ? (
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-opacity duration-150",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
    ) : backdrop === "transparent" ? (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-transparent"
        onClick={() => setOpen(false)}
      />
    ) : backdrop === "solid" ? (
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-background/80 transition-opacity duration-150",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
    ) : null;

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      data-entering={open ? "true" : undefined}
      data-exiting={!open ? "true" : undefined}
      data-placement={position?.openAbove ? "top" : "bottom"}
      className={cn(
        "fixed z-50 overflow-hidden rounded-2xl border border-divider bg-background-foreground p-2 text-foreground shadow-xl shadow-black/10 outline-none",
        "transition-[opacity,transform,filter] duration-160 ease-out will-change-transform",
        open
          ? "pointer-events-auto opacity-100 scale-100 translate-y-0 blur-0"
          : "pointer-events-none opacity-0 scale-95 translate-y-1 blur-[1px]",
        className,
      )}
      style={
        position
          ? {
              top: position.top,
              left: position.left,
              minWidth: position.minWidth,
              maxHeight,
            }
          : { opacity: 0, pointerEvents: "none" }
      }
    >
      <MenuContext.Provider value={menuCtx}>
        <div className="max-h-[inherit] overflow-auto flex flex-col gap-1 [&>*]:w-full">
          {children}
        </div>
      </MenuContext.Provider>
    </div>
  );

  if (typeof document === "undefined") return menu;
  return createPortal(
    <>
      {overlay}
      {menu}
    </>,
    document.body,
  );
}

function DropdownItem({
  children,
  id,
  href,
  target,
  rel,
  variant = "default",
  disabled,
  description,
  shortcut,
  startContent,
  endContent,
  className,
  textValue,
  isSelected,
  onClick,
}: ItemProps) {
  const {
    selectionMode,
    selectedKeys,
    disabledKeys,
    onAction,
    closeOnSelect,
    setOpen,
    toggleSelection,
    color,
  } = useMenu();
  const key =
    id ?? textValue ?? (typeof children === "string" ? children : undefined);
  const selected = Boolean(
    isSelected ?? (key !== undefined && selectedKeys.has(key)),
  );
  const itemDisabled = Boolean(
    disabled || (key !== undefined && disabledKeys.has(key)),
  );
  const isDanger = variant === "danger";

  const selectedClasses = (() => {
    if (selected) {
      if (color === "primary") return "bg-primary/10 text-primary";
      if (color === "secondary") return "bg-secondary/10 text-secondary";
      if (color === "success") return "bg-success/10 text-success";
      if (color === "warning") return "bg-warning/10 text-warning";
      if (color === "danger") return "bg-danger/10 text-danger";
      return "bg-foreground/5 text-foreground";
    }
    return "";
  })();

  const baseClasses = cn(
    "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-lg [&_*]:text-inherit outline-none transition",
    "hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    itemDisabled && "cursor-not-allowed opacity-45",
    selectedClasses,
    isDanger && !selected && "text-danger",
    className,
  );

  const handleActivate = () => {
    if (itemDisabled || key === undefined) return;
    if (selectionMode !== "none") toggleSelection(key);
    onAction?.(key);
    if (closeOnSelect) setOpen(false);
  };

  const content = (
    <>
      <span className="flex w-5 shrink-0 items-center justify-center">
        {selectionMode !== "none" && selected ? (
          <CheckIcon className="size-4" />
        ) : null}
      </span>
      {startContent ? <span className="shrink-0">{startContent}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{children}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-foreground/60">
            {description}
          </span>
        ) : null}
      </span>
      {shortcut ? (
        <span className="shrink-0 text-xs text-foreground/60">{shortcut}</span>
      ) : null}
      {endContent ? <span className="shrink-0">{endContent}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        role="menuitem"
        aria-disabled={itemDisabled || undefined}
        aria-checked={selectionMode === "none" ? undefined : selected}
        aria-label={textValue}
        onClick={(e) => {
          if (itemDisabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
          handleActivate();
        }}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role={
        selectionMode === "multiple"
          ? "menuitemcheckbox"
          : selectionMode === "single"
            ? "menuitemradio"
            : "menuitem"
      }
      aria-disabled={itemDisabled || undefined}
      aria-checked={selectionMode === "none" ? undefined : selected}
      aria-label={textValue}
      disabled={itemDisabled}
      onClick={(e) => {
        onClick?.(e);
        handleActivate();
      }}
      className={baseClasses}
    >
      {content}
    </button>
  );
}

function DropdownSection({ title, children, className }: SectionProps) {
  return (
    <div className={cn("py-1", className)}>
      {title ? (
        <div className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
          {title}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function DropdownSeparator({ className }: { className?: string }) {
  return (
    <div role="separator" className={cn("my-1 h-px bg-divider", className)} />
  );
}

const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Section: DropdownSection,
  Separator: DropdownSeparator,
});

export { Dropdown };
export default Dropdown;
