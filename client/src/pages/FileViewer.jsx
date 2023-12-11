import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function FileViewer() {
  const docs = [
    {
      uri: "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701001607/CourseDocument/vroivwlk4k3bmev534cf.docx",
    },
    {
      uri: "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701001833/CourseDocument/a5l3oeffz42tcaqb2qum.pptx",
    },
    {
      uri: "https://res.cloudinary.com/ddwapzxdc/image/upload/v1701011815/CourseDocument/och5g3ajzkracjjiuebo.pdf",
    },
    {
      uri: "https://res.cloudinary.com/ddwapzxdc/raw/upload/v1701012003/CourseDocument/jrxk54u3qs8ncidv6twr.xlsx",
    },
  ];

  return (
    <div>
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ height: 650 }}
      />
    </div>
  );
}
