export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
