// Home.tsx
export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        Welcome to My Notes
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg text-center mb-8 max-w-xl">
        Browse through the sidebar to access your notes, guides, and walkthroughs.
        Keep your learning organized and easy to navigate.
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        <div className="bg-blue-100 dark:bg-blue-800 rounded-xl px-6 py-4 hover:scale-105 hover:shadow-lg transition transform cursor-pointer flex flex-col items-center text-center max-w-xs">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">Notes</h2>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Quick access to all your notes in one place.
          </p>
        </div>

        <div className="bg-green-100 dark:bg-green-800 rounded-xl px-6 py-4 hover:scale-105 hover:shadow-lg transition transform cursor-pointer flex flex-col items-center text-center max-w-xs">
          <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Walkthroughs</h2>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Step-by-step walkthroughs for your projects or exercises.
          </p>
        </div>
      </div>
    </div>
  );
}
