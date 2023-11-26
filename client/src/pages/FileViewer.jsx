import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

export default function FileViewer() {
  const docs = [
    {
      uri: "https://calibre-ebook.com/downloads/demos/demo.docx",
      fileType: "docx",
      fileName: "demo.docx"
    },
  ];

  return (
    <div>
      <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} style={{ height: 1000 }} />
    </div>
  );
}