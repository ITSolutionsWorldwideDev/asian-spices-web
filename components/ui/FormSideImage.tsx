import Image from "next/image";

type Props = {
  className?: string;
};

export default function FormSideImage({ className }: Props) {
  const sizeClass = className ?? "h-full min-h-[480px]";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:rounded-3xl ${sizeClass}`}
    >
      <Image
        src="/assets/signup_form/bfd700b0e493c1d48adf286de20d6404d2059543.jpg"
        alt="Asian spices assortment"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
