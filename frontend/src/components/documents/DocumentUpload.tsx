import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
}

const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = (files: File[]) => {
    const newUploads = files.map((file) => ({ file, progress: 0 }));
    setUploadingFiles(newUploads);

    // Simulate upload progress
    newUploads.forEach((upload, index) => {
      const interval = setInterval(() => {
        setUploadingFiles((prev) => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index].progress += Math.random() * 30;
            if (updated[index].progress >= 100) {
              updated[index].progress = 100;
              clearInterval(interval);
              
              // Remove from uploading after a delay
              setTimeout(() => {
                setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
                onUpload([upload.file]);
              }, 500);
            }
          }
          return updated;
        });
      }, 200);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      simulateUpload(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      simulateUpload(files);
    }
    e.target.value = "";
  };

  const removeUpload = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Upload Documents</h3>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "upload-zone flex flex-col items-center justify-center py-12 text-center",
          isDragging && "drag-active"
        )}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <p className="mb-2 text-lg font-medium">
          Drag and drop files here
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          or click to browse
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileSelect}
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Browse Files
          </label>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Supported formats: PDF, DOCX, TXT, MD (Max 10MB)
        </p>
      </div>

      {/* Uploading files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadingFiles.map((upload, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3"
            >
              <File className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{upload.file.name}</p>
                <Progress value={upload.progress} className="mt-1 h-1" />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(upload.progress)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeUpload(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
