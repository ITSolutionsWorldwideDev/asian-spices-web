// app/wishlist/page.tsx

import WishList from "@/components/features/wishlist/WishList";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";

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
