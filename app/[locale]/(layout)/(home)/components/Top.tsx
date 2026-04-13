import type { StaticImageData } from 'next/image';
import { RouteEnum } from '@/constants/route';
import { Img } from '@/components/ui/img';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';
import homeTop1 from '@images/home/home-top-1.png';
import homeTop2 from '@images/home/home-top-2.png';
import homeTop3 from '@images/home/home-top-3.png';
import homeTop4 from '@images/home/home-top-4.png';
import homeTop5 from '@images/home/home-top-5.png';
import homeTop6 from '@images/home/home-top-6.png';
import { useTranslations } from 'next-intl';

type StickerItem = {
  src: StaticImageData;
  alt: string;
  desktopClassName: string;
  mobileClassName?: string;
};

const desktopStickers: StickerItem[] = [
  {
    src: homeTop1,
    alt: 'Lumobox rabbit sticker sample',
    desktopClassName: 'left-[1%] top-[0%] w-[19%] rotate-[-7deg] z-[2]',
    mobileClassName: 'row-span-2',
  },
  {
    src: homeTop2,
    alt: 'Lumobox child drawing sticker sample',
    desktopClassName: 'left-[14%] top-[20%] w-[21.5%] rotate-[-4deg] z-[3]',
    mobileClassName: 'col-span-1',
  },
  {
    src: homeTop3,
    alt: 'Lumobox squirrel house sticker sample',
    desktopClassName: 'left-[26%] top-[4%] scale-100 w-[21.5%] z-[1]',
    mobileClassName: 'col-span-1 row-span-2',
  },
  {
    src: homeTop4,
    alt: 'Lumobox printer moment sticker sample',
    desktopClassName: 'right-[36%] top-[10%] w-[21%] rotate-[6deg] z-[2]',
    mobileClassName: 'scale-150',
  },
  {
    src: homeTop5,
    alt: 'Lumobox bear house sticker sample',
    desktopClassName: 'right-[20%] top-[16%] scale-105 w-[24.5%] rotate-[6deg] z-[4]',
    mobileClassName: 'col-span-1 row-span-1',
  },
  {
    src: homeTop6,
    alt: 'Lumobox girls making stickers sample',
    desktopClassName: 'right-[2%] top-[10%] w-[21.5%] rotate-[-5deg] z-[3]',
    mobileClassName: 'col-start-3 col-span-1 row-span-1',
  },
];

export function Top({ locale }: { locale: string }) {
  const t = useTranslations('components.home');
  return (
    <section className="mx-auto mb-24 w-full">
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-3">
          {desktopStickers.map((sticker) => (
            <Sticker
              key={sticker.alt}
              src={sticker.src}
              alt={sticker.alt}
              className={cn('relative', sticker.mobileClassName)}
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 20vw"
            />
          ))}
        </div>
      </div>

      <div className="relative hidden min-h-[360px] md:block">
        {desktopStickers.map((sticker) => (
          <Sticker
            key={sticker.alt}
            src={sticker.src}
            alt={sticker.alt}
            className={cn('absolute', sticker.desktopClassName)}
            sizes="(max-width: 1280px) 20vw, 300px"
          />
        ))}
      </div>

      <div className="mx-auto flex flex-col items-center text-center lg:mt-6">
        <div className="flex flex-wrap items-center justify-center">
          <span className="font-sigmar text-[clamp(1.5rem,3.3vw,3rem)] leading-[1.2] tracking-[-0.02em] text-[#321403]">
            {t('top.lumobox')}:
          </span>
          <span className="font-sigmar text-[clamp(1rem,2.6vw,38px)] leading-[1.2] tracking-[-0.02em] text-[#321403]">
            {t('top.lumoboxInfo')}
          </span>
        </div>

        <p className="mt-5 text-[clamp(12px,1.1vw,1rem)] leading-[1.6] text-[#5b3a28]">
          Kids say it. StickerLumo prints it.Something real to hold, color, and stick — no screens
          required.
        </p>

        <Link
          href={RouteEnum.lumobox}
          className="mt-8 inline-flex min-h-14 items-center rounded-[24px] bg-[#f3c738] px-[clamp(20px,4.2vw,60px)] py-[clamp(10px,1.38vw,20px)] font-sigmar text-[clamp(1rem,1.67vw,1.5rem)] leading-none text-[#321403] lowercase shadow-[0_12px_24px_-14px_rgba(50,20,3,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-16px_rgba(50,20,3,0.75)]"
        >
          shop now
        </Link>
      </div>
    </section>
  );
}

function Sticker({
  src,
  alt,
  className,
  sizes,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <div className={className}>
      <Img
        src={src}
        alt={alt}
        sizes={sizes}
        className="h-auto w-full cursor-pointer drop-shadow-[0_20px_26px_rgba(50,20,3,0.18)] transition hover:-translate-y-1 hover:scale-110"
      />
    </div>
  );
}
