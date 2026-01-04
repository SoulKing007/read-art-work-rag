import { Video, Calendar, Users, ExternalLink, MessageSquare, Trash2, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  transcriptUrl: string;
  participants?: string[];
  notes?: string;
  createdAt: Date;
}

interface MeetingCardProps {
  meeting: Meeting;
  onViewTranscript: (meeting: Meeting) => void;
  onChat: (meeting: Meeting) => void;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MeetingCard = ({ meeting, onViewTranscript, onChat, onEdit, onDelete }: MeetingCardProps) => {
  return (
    <div className="card-hover group rounded-xl border border-border border-l-4 border-l-primary bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{meeting.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(meeting.date)}</span>
              <span>•</span>
              <span>{formatTime(meeting.date)}</span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(meeting)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(meeting)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Participants */}
      {meeting.participants && meeting.participants.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{meeting.participants.join(", ")}</span>
        </div>
      )}

      {/* Notes preview */}
      {meeting.notes && (
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {meeting.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewTranscript(meeting)}
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          View Transcript
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChat(meeting)}
        >
          <MessageSquare className="mr-1 h-3 w-3" />
          Chat About This
        </Button>
      </div>
    </div>
  );
};

export default MeetingCard;
