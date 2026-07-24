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
        <div className="relative z-10 flex min-h-dvh flex-col">
          <MenuNavbar />
          <main className="container mx-auto flex-1 px-4 lg:py-6">
            {children}
          </main>
        </div>
        <BackgroundParticles />
      </Providers>
    </>
  );
}
