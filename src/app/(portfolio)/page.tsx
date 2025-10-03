import {
  ButtonDownload,
  Chart,
  ImageManager,
  TypeAnimations,
} from "@/components";
import { ButtonComponent } from "@/components/components/ButtonComponent";

export default function Portfolio() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-5 gap-y-10">
      <div className="col-span-2 md:col-span-6 lg:col-span-8 grid gap-10 md:gap-8 lg:gap-5">
        <h1 className="flex flex-col gap-2 text-7xl lg:text-8xl font-semibold tracking-tight inline">
          <span className="bg-clip-text ">Hola soy </span>
          <TypeAnimations />
        </h1>
        <p className="text-3xl md:text-2xl">
          Soy un desarrollador fullstack con 2 años de experiencia en Next.js -
          React. He trabajado en varios proyectos personales, creando y
          consumiendo APIs, lo que me ha permitido fortalecer mis habilidades en
          el desarrollo web de extremo a extremo.<br></br> Revisa mis proyectos!
        </p>
        <div className="flex gap-4">
          <ButtonComponent
            url="/contact"
            variant="shadow"
            className="rounded-full"
          >
            Contacta
          </ButtonComponent>

          <ButtonDownload
            url={
              "https://res.cloudinary.com/dzftv7yux/image/upload/v1759380592/CV_todoft.pdf"
            }
            text={"Descargar CV"}
          />
        </div>
        <div className="w-full">
          <Chart />
        </div>
      </div>
      <div className="col-span-2 md:col-span-6 lg:col-span-4 flex flex-col items-center justify-center gap-5 text-center">
        <ImageManager />
        <h1 className="flex items-center justify-center">
          <em>
            Mis hobbies son dibujar, hacer ejercicio y jugar <br></br>Nota:
            Algunos los hice con el mouse 😈
          </em>
        </h1>
      </div>
    </div>
  );
}
