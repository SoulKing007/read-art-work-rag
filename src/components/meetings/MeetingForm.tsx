import { useState } from "react";
import { Plus, X, Calendar, Link as LinkIcon, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MeetingFormProps {
  onSubmit: (meeting: {
    title: string;
    date: Date;
    transcriptUrl: string;
    participants: string[];
    notes: string;
  }) => void;
}

const MeetingForm = ({ onSubmit }: MeetingFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [transcriptUrl, setTranscriptUrl] = useState("");
  const [participants, setParticipants] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (!transcriptUrl.trim()) newErrors.transcriptUrl = "Transcript URL is required";
    else if (!transcriptUrl.startsWith("http")) {
      newErrors.transcriptUrl = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const meetingDate = new Date(`${date}T${time || "09:00"}`);
    onSubmit({
      title: title.trim(),
      date: meetingDate,
      transcriptUrl: transcriptUrl.trim(),
      participants: participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      notes: notes.trim(),
    });

    // Reset form
    setTitle("");
    setDate("");
    setTime("");
    setTranscriptUrl("");
    setParticipants("");
    setNotes("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDate("");
    setTime("");
    setTranscriptUrl("");
    setParticipants("");
    setNotes("");
    setErrors({});
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add New Meeting
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-scale-in">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add New Meeting</h3>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Weekly Standup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`pl-9 ${errors.date ? "border-destructive" : ""}`}
              />
            </div>
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* Transcript URL */}
        <div className="space-y-2">
          <Label htmlFor="transcriptUrl">Transcript URL *</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="transcriptUrl"
              placeholder="https://example.com/transcript/..."
              value={transcriptUrl}
              onChange={(e) => setTranscriptUrl(e.target.value)}
              className={`pl-9 ${errors.transcriptUrl ? "border-destructive" : ""}`}
            />
          </div>
          {errors.transcriptUrl && (
            <p className="text-xs text-destructive">{errors.transcriptUrl}</p>
          )}
        </div>

        {/* Participants */}
        <div className="space-y-2">
          <Label htmlFor="participants">Participants</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="participants"
              placeholder="John, Sarah, Mike (comma-separated)"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="notes"
              placeholder="Meeting description or key points..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] pl-9"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Meeting</Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
