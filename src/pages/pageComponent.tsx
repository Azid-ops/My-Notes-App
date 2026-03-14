import { useState } from "react";
import ScriptBlock from "./ScriptBlock";
import UnderstandingModal from "./UnderstandingModal";
import { LightBulbIcon } from "@heroicons/react/24/solid"; // Heroicons

export default function PageComponent({ page }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      {page.scriptFile && (
        <div className="relative">
          <ScriptBlock
            file={page.scriptFile}
            language={page.language}
          />

          {/* Floating Icon Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-2 p-3 bg-blue-600 text-white rounded-l-full hover:bg-blue-700 shadow-lg z-20 flex items-center justify-center"
            title="Understanding"
          >
            <LightBulbIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      <UnderstandingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        explanationFile={page.explanationFile}
      />
    </div>
  );
}