import { MenuNavbar } from "@/components";
import { Providers } from "../providers";
import { BackgroundParticles } from "@/components/ui/background";

export default function LayoutMain({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Providers>
        <MenuNavbar />
        <div className="container mt-24 mx-auto px-4 px-12 lg:py-6 z-10 ">
          {children}
        </div>
        <BackgroundParticles />
      </Providers>
    </>
  );
}
