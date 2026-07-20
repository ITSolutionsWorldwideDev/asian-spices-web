import Link from "next/link";
import Image from "next/image";
import FooterContent from "../layout/footer/FooterContent";

export default function Footer() {
  return (
    <footer className="relative w-full text-black py-12 bg-linear-to-r from-orange-300 to-orange-400 mt-20 z-10 overflow-hidden">
      <div className="absolute left-0 bottom-0 w-full pointer-events-none z-0 h-full">
        <Image
          src="/assets/footer/775175c8c1ddc9012a4b84d26589e2965949605d.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-5"
          loading="lazy"
        />
      </div>

      <FooterContent />
      <p className="text-center mt-10 text-sm">
        Powered by{" "}
        <Link
          href="https://www.itsolutionsworldwide.com/"
          className="cursor-pointer hover:underline"
        >
          IT Solutions Worldwide
        </Link>
      </p>
    </footer>
  );
}
