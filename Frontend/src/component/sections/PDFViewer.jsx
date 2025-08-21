// src/components/PDFTextExtractor.jsx
import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFTextExtractor = () => {
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    const extractText = async () => {
      const dataUrl = localStorage.getItem('uploadedPDF');
      if (!dataUrl) {
        setTextContent('No PDF found in localStorage.');
        console.log("Nahi mila re")
        return;
      }

      console.log("Mila to hai")
      // Remove the data URL prefix to get just the base64 string
      const base64 = dataUrl.split(',')[1];

      // Convert base64 to Uint8Array
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      console.log("Hello 1")
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      console.log("Hello 2")
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        fullText += `\n\n--- Page ${i} ---\n${text}`;
      }
      console.log("Hello 3")

      setTextContent(fullText);
    };

    extractText();
  }, []);

  return (
    <div style={{ whiteSpace: 'pre-wrap', padding: '1rem', fontFamily: 'monospace', backgroundColor: "#333", color: "white" }}>
      {textContent ? textContent : 'Nahi hai'}
    </div>
  );
};

export default PDFTextExtractor;
