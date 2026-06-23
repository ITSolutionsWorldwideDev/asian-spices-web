// components/layout/account/profile/ProfileSkeleton.tsx

export default function ProfileSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-1/4 bg-gray-300 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ))}

      <div className="h-10 w-32 bg-gray-300 rounded mt-4" />
    </div>
  );
}