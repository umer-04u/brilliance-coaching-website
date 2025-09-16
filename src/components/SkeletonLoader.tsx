export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-700 p-4 rounded-lg animate-pulse flex justify-between items-center"
        >
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/6"></div>
          <div className="h-4 bg-gray-600 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
}
