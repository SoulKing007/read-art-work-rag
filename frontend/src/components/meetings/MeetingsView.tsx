import { useState } from "react";
import { Search, Calendar, SortAsc } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MeetingForm from "./MeetingForm";
import MeetingCard, { Meeting } from "./MeetingCard";

// Sample data
const sampleMeetings: Meeting[] = [
  {
    id: "1",
    title: "Weekly Product Standup",
    date: new Date(2026, 0, 3, 10, 0),
    transcriptUrl: "https://zoom.us/rec/transcript/abc123",
    participants: ["John", "Sarah", "Mike", "Emily"],
    notes: "Discussed Q1 roadmap priorities and upcoming feature releases.",
    createdAt: new Date(2026, 0, 3),
  },
  {
    id: "2",
    title: "Engineering Retrospective",
    date: new Date(2026, 0, 2, 14, 30),
    transcriptUrl: "https://meet.google.com/transcript/xyz789",
    participants: ["Alex", "Jordan", "Taylor"],
    notes: "Reviewed sprint outcomes and identified areas for improvement.",
    createdAt: new Date(2026, 0, 2),
  },
  {
    id: "3",
    title: "Client Onboarding Call",
    date: new Date(2025, 11, 28, 9, 0),
    transcriptUrl: "https://teams.microsoft.com/transcript/def456",
    participants: ["Sarah", "Client Team"],
    notes: "Walked through platform features and implementation timeline.",
    createdAt: new Date(2025, 11, 28),
  },
];

const MeetingsView = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const handleAddMeeting = (data: {
    title: string;
    date: Date;
    transcriptUrl: string;
    participants: string[];
    notes: string;
  }) => {
    const newMeeting: Meeting = {
      id: `new-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    toast.success(`Meeting "${data.title}" added successfully`);
  };

  const handleViewTranscript = (meeting: Meeting) => {
    window.open(meeting.transcriptUrl, "_blank");
  };

  const handleChat = (meeting: Meeting) => {
    toast.info(`Opening chat for: ${meeting.title}`);
  };

  const handleEdit = (meeting: Meeting) => {
    toast.info(`Editing: ${meeting.title}`);
  };

  const handleDelete = (meeting: Meeting) => {
    setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
    toast.success(`Deleted: ${meeting.title}`);
  };

  const filteredMeetings = meetings
    .filter(
      (m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.participants?.some((p) =>
          p.toLowerCase().includes(search.toLowerCase())
        )
    )
    .sort((a, b) => {
      if (sortBy === "recent") return b.date.getTime() - a.date.getTime();
      if (sortBy === "oldest") return a.date.getTime() - b.date.getTime();
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Meeting Transcripts</h1>
        <p className="text-muted-foreground">
          Manage and search your meeting recordings
        </p>
      </div>

      {/* Add meeting form */}
      <MeetingForm onSubmit={handleAddMeeting} />

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or participants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meetings list */}
        {filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="mb-1 font-medium">No meetings found</h4>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Try a different search term"
                : "Add your first meeting to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onViewTranscript={handleViewTranscript}
                onChat={handleChat}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredMeetings.length} of {meetings.length} meetings
        </div>
      </div>
    </div>
  );
};

export default MeetingsView;
