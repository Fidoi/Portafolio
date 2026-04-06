"use client";

import { Card, CardFooter, Image } from "@heroui/react";
import Link from "next/link";

interface Props {
  title: string;
  urlImage: string;
  url: string;
}

export const Cards = ({ title, urlImage, url }: Props) => {
  return (
    <Card className="max-w-xl">
      <Link href={url}>
        <Image
          isZoomed
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={urlImage}
          width={300}
          height={300}
        />
      </Link>
      <CardFooter className="backdrop-blur-2xl before:bg-white/10 border-white/20 border-1 overflow-hidden py-3 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex justify-center pointer-events-none cursor-default">
        <div className="inline-block">
          <h1
            className="font-extrabold text-2xl text-accent tracking-tight"
            style={{
              textShadow: `
        0.5px 0 0 rgba(0,0,0,0.85),
        -0.5px 0 0 rgba(0,0,0,0.85),
        0 0.5px 0 rgba(0,0,0,0.85),
        0 -0.5px 0 rgba(0,0,0,0.85),
        0 2px 8px rgba(0,0,0,0.2)
      `,
            }}
          >
            {title}
          </h1>
          <div className="mt-1 h-[3px] rounded-full bg-gradient-to-r from-accent to-primary"></div>
        </div>
      </CardFooter>
    </Card>
  );
};
