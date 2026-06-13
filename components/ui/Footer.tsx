import FooterContent from "../layout/footer/FooterContent";

export default function Footer() {
  return (
    <footer className="relative w-full  text-black py-12 bg-linear-to-r from-orange-300 to-orange-400 mt-20 z-10 overflow-hidden">
      
      <div className="absolute  left-0 bottom-0 w-full pointer-events-none   z-0">
        <img
          src="/assets/footer/775175c8c1ddc9012a4b84d26589e2965949605d.png"
          alt=""
          className="w-full  object-cover h-full opacity-5"
        />
      </div>

      <FooterContent />
      {/* Bottom Text */}
      <p className="text-center mt-10 text-sm">
        Powered by IT Solutions Worldwide
      </p>
    </footer>
  );
}
