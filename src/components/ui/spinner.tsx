export function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-[200px]">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
}
