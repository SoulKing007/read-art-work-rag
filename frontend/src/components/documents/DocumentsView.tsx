import { useState } from "react";
import { toast } from "sonner";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";
import { Document } from "./DocumentCard";

// Sample data
const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Q4_Financial_Report_2025.pdf",
    type: "application/pdf",
    size: 2457600,
    uploadedAt: new Date(Date.now() - 86400000),
    status: "embedded",
  },
  {
    id: "2",
    name: "Product_Roadmap.docx",
    type: "application/msword",
    size: 1024000,
    uploadedAt: new Date(Date.now() - 172800000),
    status: "embedded",
  },
  {
    id: "3",
    name: "Meeting_Notes_January.txt",
    type: "text/plain",
    size: 45000,
    uploadedAt: new Date(Date.now() - 3600000),
    status: "processing",
  },
  {
    id: "4",
    name: "Technical_Specifications.pdf",
    type: "application/pdf",
    size: 5120000,
    uploadedAt: new Date(Date.now() - 604800000),
    status: "embedded",
  },
];

const DocumentsView = () => {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);

  const handleUpload = (files: File[]) => {
    const newDocs: Document[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      status: "processing" as const,
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
    toast.success(`${files.length} file(s) uploaded successfully`);

    // Simulate embedding completion
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          newDocs.some((nd) => nd.id === doc.id)
            ? { ...doc, status: "embedded" as const }
            : doc
        )
      );
      toast.success("Documents have been embedded");
    }, 3000);
  };

  const handleViewDocument = (doc: Document) => {
    toast.info(`Viewing: ${doc.name}`);
  };

  const handleDeleteDocument = (doc: Document) => {
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    toast.success(`Deleted: ${doc.name}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your documents for RAG-powered search
        </p>
      </div>

      <DocumentUpload onUpload={handleUpload} />
      
      <DocumentList
        documents={documents}
        onViewDocument={handleViewDocument}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default DocumentsView;
