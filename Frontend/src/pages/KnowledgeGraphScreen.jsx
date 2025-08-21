import React, { useState, useEffect } from "react";
import UploadModal from "../component/UploadModal";
import { Upload, RefreshCcw } from "lucide-react";

const KnowledgeGraph = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const URL = "http://127.0.0.1:8000";

  const handleRefreshKnowledge = () => {
    fetch(
      `${URL}/graph`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    )
      .then((response) => response.text()) // Convert response to text
      .then((data) => setHtmlContent(data)) // Store HTML in state
      .catch((error) => console.error("Error fetching HTML:", error));
  };

  return (
    <div className="text-black h-screen bg-white p-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-black">
            Knowledge graph
          </h1>
          <p className="text-gray-500 mb-6">
            Upload a file to render knowledge graph.
          </p>
        </div>

        <div className="flex justify-end items-center mb-6 space-x-4">
          <button
            onClick={handleRefreshKnowledge}
            className="flex items-center px-4 py-2 bg-transparent text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-500 hover:text-white transition cursor-pointer"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Refresh
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition cursor-pointer"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload files
          </button>
        </div>
      </div>

      {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="border p-4" /> */}
      <iframe
        srcDoc={htmlContent} // Pass the HTML response here
        title="Embedded HTML"
        style={{ width: "100%", height: "600px", border: "1px solid black" }}
        className="scrollbar-hidden"
      />

      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          showExtra={false}
          setFile={setFile}
          type={"knowledge"}
        />
      )}
    </div>
  );
};

export default KnowledgeGraph;
