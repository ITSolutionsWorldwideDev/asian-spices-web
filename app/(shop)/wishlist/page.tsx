// app/wishlist/page.tsx

import WishList from "@/components/features/wishlist/WishList";
import Footer from "@/components/layout/Footer";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <WishList />

      <Footer />
    </div>
  );
}
