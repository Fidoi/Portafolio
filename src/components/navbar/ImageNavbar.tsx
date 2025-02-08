import { Image } from '@heroui/image';

interface ImageNavbarProps {
  thumbnail: string;
}

export const ImageNavbar = ({ thumbnail }: ImageNavbarProps) => {
  return (
    <Image
      isZoomed
      isBlurred
      alt='Miniatura de la canción'
      src={thumbnail}
      width={75}
      height={75}
    />
  );
};
