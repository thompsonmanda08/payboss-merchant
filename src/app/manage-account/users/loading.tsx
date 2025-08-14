'use client';

export default function UsersLoading({}) {
  return (
    <div className="w-full mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="bg-gray-200 h-10 w-64 rounded-md animate-pulse" />
        <div className="bg-gray-200 h-5 w-full max-w-2xl rounded-md animate-pulse" />
      </div>

      {/* Search and filters container */}
      <div className="border rounded-lg p-4 space-y-4">
        {/* Search and filters row */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="bg-gray-200 h-10 rounded-md animate-pulse w-full sm:w-1/2 lg:w-1/3" />
          <div className="flex gap-3">
            <div className="bg-gray-200 h-10 w-28 rounded-md animate-pulse" />
            <div className="bg-gray-200 h-10 w-28 rounded-md animate-pulse" />
            <div className="bg-gray-200 h-10 w-40 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Total users and rows per page */}
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 h-5 w-24 rounded-md animate-pulse" />
          <div className="bg-gray-200 h-5 w-40 rounded-md animate-pulse" />
        </div>

        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 border-b pb-2">
          <div className="bg-gray-200 h-6 w-20 rounded-md animate-pulse" />
          <div className="bg-gray-200 h-6 w-40 rounded-md animate-pulse" />
          <div className="bg-gray-200 h-6 w-20 rounded-md animate-pulse" />
          <div className="bg-gray-200 h-6 w-20 rounded-md animate-pulse justify-self-end" />
        </div>

        {/* Table rows */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-gray-300 h-10 w-10 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="bg-gray-200 h-5 w-32 rounded-md animate-pulse" />
                <div className="bg-gray-200 h-4 w-40 rounded-md animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-5 w-24 rounded-md animate-pulse" />
              <div className="bg-gray-200 h-4 w-32 rounded-md animate-pulse" />
            </div>
            <div>
              <div className="bg-gray-200 h-6 w-20 rounded-full animate-pulse" />
            </div>
            <div className="flex justify-end gap-2">
              <div className="bg-gray-200 h-8 w-8 rounded-md animate-pulse" />
              <div className="bg-gray-200 h-8 w-8 rounded-md animate-pulse" />
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <div className="bg-blue-200 h-8 w-8 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-200 h-8 w-24 rounded-md animate-pulse" />
            <div className="bg-gray-200 h-8 w-24 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
