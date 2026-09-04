import { useEffect, useState } from 'react';

type Commit = {
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
};

export default function Home() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sirf is specific repository ki commits fetch karne ke liye API
    fetch('https://api.github.com/repos/MAHAD-ALI-AWAN/My-Notes-App/commits?per_page=5')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCommits(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        Welcome to My Notes
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg text-center mb-8 max-w-xl">
        Browse through the sidebar to access your notes, guides, and walkthroughs.
        Keep your learning organized and easy to navigate.
      </p>

      {/* Specific Repository Commits Section */}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-between">
          <span>Project Development History (My-Notes-App Commits)</span>
          <span className="text-xs text-blue-400 font-normal">Live from GitHub</span>
        </h2>
        
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-4">Loading commit history...</p>
        ) : commits.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {commits.map((item: Commit, index: number) => (
              <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-xs flex flex-col gap-1">
                <p className="font-medium text-gray-200 truncate">{item.commit.message}</p>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>By: {item.commit.author.name}</span>
                  <span>{new Date(item.commit.author.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">No commits found or API limit reached.</p>
        )}
      </div>

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