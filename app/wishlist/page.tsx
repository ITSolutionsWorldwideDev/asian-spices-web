// app/wishlist/page.tsx

import WishList from "@/components/layout/wishlist/WishList";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-black">
        <Nav />
      </div>

      <WishList />

      <Footer />
    </div>
  );
}
