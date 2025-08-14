'use client';

export default function WorkspacesLoading({ showHeader = true, length = 6 }) {
  return (
    <div className="w-full mx-auto space-y-4">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-row items-end justify-between mb-6">
          <div className="space-y-2 flex-1">
            <div className="bg-gray-200 h-8 w-64 rounded-md animate-pulse" />
            <div className="bg-gray-200 h-5 w-full max-w-2xl rounded-md animate-pulse" />
          </div>

          {/* New Button */}
          <div className="flex justify-end w-max">
            <div className="bg-gray-200 h-8 w-20 rounded-md animate-pulse" />
          </div>
        </div>
      )}

      {/* Workspace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length }, (_, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <div className="bg-gray-200 h-6 w-24 rounded-md" />
                <div className="bg-gray-200 h-4 w-40 rounded-md" />
              </div>
            </div>
            <div className="bg-gray-200 h-6 w-6 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
