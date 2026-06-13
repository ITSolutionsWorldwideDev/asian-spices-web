const announcements = [
  "100% Organic Certified",
  "Free Shipping Over $50",
  "30-Day Money Back",
  "4.9/5 Rating (10K+ Reviews)",
];

export default function AnnouncementBar() {
  return (
    <div className="relative z-10 bg-black text-white p-3 ">
      <div className="container relative z-10 mx-auto flex justify-around items-center lg:p-10  font-semibold flex-wrap overflow-hidden">
        {announcements.map((text, index) => (
          <div key={index}>
            <span className="whitespace-nowrap">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
