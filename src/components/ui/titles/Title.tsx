import { montserrat, inter } from '@/config/fonts';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
  fontClass?: 'montserrat' | 'inter'; // Prop para seleccionar la fuente
}

export const Title = ({ title, subtitle, className, fontClass }: Props) => {
  // Determina cuál clase de fuente aplicar
  const fontStyle =
    fontClass === 'inter' ? inter.className : montserrat.className;

  return (
    <div className={`mt-3 ${className}`}>
      <h1
        className={`${fontStyle} antialiased text-4xl font-semibold my-10 ${className}`}
      >
        {title}
      </h1>
      {subtitle && <h3 className='text-xl mb-10'>{subtitle}</h3>}
    </div>
  );
};
