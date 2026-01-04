import { FileText, FileSpreadsheet, File, Eye, Trash2, MoreVertical, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: "processing" | "embedded" | "failed";
}

interface DocumentCardProps {
  document: Document;
  view: "grid" | "list";
  onView?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
}

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return FileText;
  if (type.includes("sheet") || type.includes("excel")) return FileSpreadsheet;
  return File;
};

const getFileColor = (type: string) => {
  if (type.includes("pdf")) return "text-red-500";
  if (type.includes("sheet") || type.includes("excel")) return "text-green-500";
  if (type.includes("word") || type.includes("doc")) return "text-blue-500";
  return "text-muted-foreground";
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const DocumentCard = ({ document, view, onView, onDelete }: DocumentCardProps) => {
  const FileIcon = getFileIcon(document.type);
  const fileColor = getFileColor(document.type);

  const statusBadge = {
    processing: { label: "Processing", className: "badge-processing" },
    embedded: { label: "Embedded", className: "badge-embedded" },
    failed: { label: "Failed", className: "badge-failed" },
  };

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
        <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg bg-muted", fileColor)}>
          <FileIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium" title={document.name}>
            {document.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
          </p>
        </div>
        <Badge variant="secondary" className={statusBadge[document.status].className}>
          {statusBadge[document.status].label}
        </Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onView?.(document)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(document)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-hover group rounded-xl border border-border bg-card p-4">
      {/* File icon */}
      <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-muted", fileColor)}>
        <FileIcon className="h-8 w-8" />
      </div>

      {/* File info */}
      <div className="mb-3">
        <p className="truncate font-medium" title={document.name}>
          {document.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
        </p>
      </div>

      {/* Status badge */}
      <Badge variant="secondary" className={cn("mb-4", statusBadge[document.status].className)}>
        {statusBadge[document.status].label}
      </Badge>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView?.(document)}
        >
          <Eye className="mr-1 h-3 w-3" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete?.(document)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete?.(document)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DocumentCard;
