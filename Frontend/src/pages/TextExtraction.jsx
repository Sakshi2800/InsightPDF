import React, { useState, useEffect } from 'react';
import { FileUp, FileText, Trash2, FileStack, AlignLeft, BookmarkIcon, HeadingIcon, FileSignature } from 'lucide-react';
import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import axios from 'axios';
import PDFViewer from '../component/sections/PDFViewer';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "node_modules/pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const TextExtraction = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentStructure, setDocumentStructure] = useState({
    header: '',
    mainContent: '',
    conclusion: '',
    references: '',
    summary: ''
  });
  const [activeSection, setActiveSection] = useState('header');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [response, setResponse] = useState("");

  const BACKEND_URL = "http://127.0.0.1:8001";

  const extractTextFromPDF = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
    }
    return text;
  };


  const extractDocumentSections = (text) => {
    // Normalize text and split into lines
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    // Default structure
    const sections = {
      header: '',
      mainContent: '',
      conclusion: '',
      references: ''
    };

    // Try to detect different sections
    const headerKeywords = ['title', 'header', 'abstract'];
    const conclusionKeywords = ['conclusion', 'summary', 'final thoughts'];
    const referencesKeywords = ['references', 'bibliography', 'works cited'];
    const summaryKeywords = ['summary', 'executive summary', 'overview'];

    // Find header (first few lines)
    sections.header = lines.slice(0, 3).join('\n');

    // Find conclusion and references
    const conclusionStart = lines.findIndex(line => 
      conclusionKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      )
    );

    const summaryStart = lines.findIndex(line => 
      summaryKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      )
    );

    const referencesStart = lines.findIndex(line => 
      referencesKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      )
    );

    // Extract main content (everything between header and conclusion/references)
    const mainContentStart = sections.header ? 3 : 0;
    const mainContentEnd = conclusionStart !== -1 ? conclusionStart : 
                           referencesStart !== -1 ? referencesStart : 
                           lines.length;
    
    sections.mainContent = lines.slice(mainContentStart, mainContentEnd).join('\n');

    if (summaryStart !== -1) {
      const summaryEnd = conclusionStart !== -1 ? conclusionStart : 
                        referencesStart !== -1 ? referencesStart : 
                        lines.length;
      sections.summary = lines.slice(summaryStart, summaryEnd).join('\n');
    }

    // Extract conclusion if found
    if (conclusionStart !== -1) {
      const conclusionEnd = referencesStart !== -1 ? referencesStart : lines.length;
      sections.conclusion = lines.slice(conclusionStart, conclusionEnd).join('\n');
    }

    // Extract references if found
    if (referencesStart !== -1) {
      sections.references = lines.slice(referencesStart).join('\n');
    }

    // Fallback if sections are empty
    if (!sections.mainContent) {
      sections.mainContent = lines.join('\n');
    }

    return sections;
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files[0];
    if (!files) return;

    setIsLoading(true);
    setError(null);
    setUploadedFile(files);
    
    const formData = new FormData();
    formData.append("file", files);  // Use "file" (singular)
    
    const response = await axios.post(`${BACKEND_URL}/process-docs/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log(response.data);
    
    const question = "Give me the " + activeSection + " of this pdf";
    const sectionsResponse = await axios.post(`${BACKEND_URL}/ask/`, { question });
    const data = sectionsResponse.data;
    setResponse(data.response);

    setIsLoading(false);

    // try {
    //   let text = '';
      
    //   if (file.type === 'application/pdf') {
    //     // Extract text from PDF
    //     const arrayBuffer = await file.arrayBuffer();
    //     text = await extractTextFromPDF(arrayBuffer);
    //   }  else if (
    //     file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    //     file.type === 'application/msword'
    //   ) {
    //     const arrayBuffer = await file.arrayBuffer();
    //     const result = await mammoth.extractRawText({ arrayBuffer });
    //     text = result.value;
    //   } else if (file.type === 'text/plain') {
    //     text = await file.text();
    //   } else {
    //     throw new Error('Unsupported file type');
    //   }

    //   // Ensure text is not empty
    //   if (!text.trim()) {
    //     throw new Error('No text could be extracted from the document');
    //   }

    //   // Extract document sections
    //   const sections = extractDocumentSections(text);
    //   setDocumentStructure(sections);
      
    //   // Set main content as default active section
    //   setActiveSection('header');


    // } catch (err) {
    //   setError(err.message);
    //   setUploadedFile(null);
    //   setDocumentStructure({
    //     header: '',
    //     mainContent: '',
    //     conclusion: '',
    //     references: '',
    //     summary: ''
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setDocumentStructure({
      header: '',
      mainContent: '',
      conclusion: '',
      references: '',
      summary: ''
    });
    setActiveSection('header');
    setError(null);
  };

  // Section tabs configuration
  const sectionTabs = [
    { 
      key: 'header', 
      label: 'Header', 
      icon: <HeadingIcon className="w-5 h-5 mr-2" /> 
    },
    { 
      key: 'mainContent', 
      label: 'Main Content', 
      icon: <FileStack className="w-5 h-5 mr-2" /> 
    },
    { 
      key: 'summary', 
      label: 'Summary', 
      icon: <FileSignature className="w-5 h-5 mr-2" /> 
    },
    { 
      key: 'conclusion', 
      label: 'Conclusion', 
      icon: <BookmarkIcon className="w-5 h-5 mr-2" /> 
    },
    { 
      key: 'references', 
      label: 'References', 
      icon: <FileText className="w-5 h-5 mr-2" /> 
    }
  ];

  useEffect(() => {
    const getSection = async () => {
      const question = "Give me the " + activeSection + " of this pdf";
      const sectionsResponse = await axios.post(`${BACKEND_URL}/ask/`, { question });
      const data = sectionsResponse.data;
      setResponse(data.response);
    }

    getSection();

  }, [activeSection]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        {/* File Upload Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Upload Document</h2>
          <div className="border-2 border-dashed border-gray-300 p-4 text-center">
            <input 
              type="file" 
              accept=".docx,.doc,.txt,.pdf"
              onChange={handleFileUpload}
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center"
            >
              <FileUp className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Upload Document
                <br />
                <span className="text-sm text-gray-500">
                  (DOCX, PDF, TXT)
                </span>
              </p>
            </label>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="space-y-2">
          {sectionTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`
                w-full text-left p-2 rounded flex items-center
                ${activeSection === tab.key 
                  ? 'bg-purple-500 text-white' 
                  : 'hover:bg-purple-200 bg-purple-100 text-purple-800'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Remove File Button */}
        {uploadedFile && (
          <button 
            onClick={handleRemoveFile}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded flex items-center justify-center"
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Remove Document
          </button>
        )}
      </div>

      {/* <PDFViewer /> */}
        
      {/* Document Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="text-center text-gray-600">Processing document...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {response? 
            <pre className="whitespace-pre-wrap mb-4 text-black">
              {/* {sectionTabs.find(tab => tab.key === activeSection)?.label || 'Document Content'} */}
              {response}
            </pre>
            :
            <div className="prose max-w-full">
              <pre className="whitespace-pre-wrap text-gray-800 min-h-[400px]">
                {documentStructure[activeSection] || 'No content found for this section.'}
              </pre>
            </div>

            }
          </div>
        )}
      </div>

      
    </div>
  );
};

export default TextExtraction;