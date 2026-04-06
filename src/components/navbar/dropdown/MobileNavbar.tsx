"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { MdWork, MdEmail } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { CiMenuBurger } from "react-icons/ci";
import Dropdown from "./Dropdown";
import { Button } from "@heroui/react";

export const MobileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Dropdown backdrop="blur" placement="bottom end">
      <Dropdown.Trigger>
        <Button disableRipple radius="sm" color="primary" size="lg">
          <CiMenuBurger className="text-2xl" />
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Menu
        ariaLabel="Navegación"
        className="w-[340px] text-lg"
        color="primary"
      >
        <Dropdown.Item
          href="/"
          startContent={<FaHome />}
          className={pathname === "/" ? "text-primary" : "text-foreground"}
        >
          Inicio
        </Dropdown.Item>

        <Dropdown.Item
          href="/projects"
          startContent={<MdWork />}
          className={
            pathname === "/projects" ? "text-primary" : "text-foreground"
          }
        >
          Proyectos
        </Dropdown.Item>

        <Dropdown.Item
          href="/integrations"
          startContent={<AiFillEye />}
          className={
            pathname === "/integrations" ? "text-primary" : "text-foreground"
          }
        >
          Integraciones
        </Dropdown.Item>

        <Dropdown.Item
          href="/contact"
          startContent={<MdEmail />}
          className={
            pathname === "/contact" ? "text-warning" : "text-foreground"
          }
        >
          Contacto
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
