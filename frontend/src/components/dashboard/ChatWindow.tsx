"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Search,
  MessageSquare,
  ArrowLeft,
  Clock,
  Video,
  Calendar,
  Check,
  CheckCheck,
  HelpCircle,
  Tag,
  MoreHorizontal,
  Inbox,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatHistory, useSendMessage, chatKeys } from "@/hooks/queries/useChat";
import { getSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  course?: string; // Expertise / batch tag (muted secondary)
  activeDoubtTopic?: string; // Active doubt title (bolder primary)
  expertiseTags?: string[];
  availabilityNote?: string;
  nextFreeSlot?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface ChatWindowProps {
  contacts: ChatContact[];
  contactsLoading: boolean;
  role: "student" | "mentor";
  defaultSelectedId?: string | null;
}

interface ParsedMessage {
  type: "text" | "doubt_request" | "meet_request" | "meet_scheduled";
  text?: string;
  subject?: string;
  topic?: string;
  details?: string;
  date?: string;
  time?: string;
  link?: string;
}

const DEFAULT_SUBJECTS = [
  "Web Development",
  "Data Structures & Algorithms",
  "System Design",
  "Career Guidance",
];

const BASE_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const PENDING_LINK = "PENDING";

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatDateLabel = (iso?: string) => {
  if (!iso) return "";
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
};

const getSlotsForDate = (dateStr: string): { time: string; status: "free" | "busy" }[] => {
  const seed = dateStr.split("-").reduce((acc, part) => acc + Number(part || 0), 0);
  return BASE_SLOTS.map((time, index) => ({
    time,
    status: (index + seed) % 3 === 0 ? "busy" : "free",
  }));
};

const parseMessageContent = (msgText: string): ParsedMessage => {
  if (msgText.startsWith("[DOUBT_REQUEST]")) {
    const subjectMatch = msgText.match(/Subject:\s*(.*?)(?:\s*\||$)/);
    const titleMatch = msgText.match(/Title:\s*(.*?)(?:\s*\||$)/);
    const detailsMatch = msgText.match(/Details:\s*(.*?)(?:\s*\||$)/);
    return {
      type: "doubt_request",
      subject: subjectMatch ? subjectMatch[1] : "",
      topic: titleMatch ? titleMatch[1] : "Doubt Session",
      details: detailsMatch ? detailsMatch[1] : "",
    };
  }
  if (msgText.startsWith("[MEET_REQUEST]")) {
    const topicMatch = msgText.match(/Topic:\s*(.*?)(?:\s*\||$)/);
    const detailsMatch = msgText.match(/Details:\s*(.*?)(?:\s*\||$)/);
    return {
      type: "meet_request",
      topic: topicMatch ? topicMatch[1] : "Mentor Session",
      details: detailsMatch ? detailsMatch[1] : "",
    };
  }
  if (msgText.startsWith("[MEET_SCHEDULED]")) {
    const dateMatch = msgText.match(/Date:\s*(.*?)(?:\s*\||$)/);
    const timeMatch = msgText.match(/Time:\s*(.*?)(?:\s*\||$)/);
    const linkMatch = msgText.match(/Link:\s*(.*?)(?:\s*\||$)/);
    const topicMatch = msgText.match(/Topic:\s*(.*?)(?:\s*\||$)/);
    return {
      type: "meet_scheduled",
      date: dateMatch ? dateMatch[1] : "",
      time: timeMatch ? timeMatch[1] : "",
      link: linkMatch ? linkMatch[1] : "",
      topic: topicMatch ? topicMatch[1] : "",
    };
  }
  return { type: "text", text: msgText };
};

export function ChatWindow({
  contacts,
  contactsLoading,
  role,
  defaultSelectedId,
}: ChatWindowProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileViewActive, setIsMobileViewActive] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  const [pendingRequests, setPendingRequests] = useState<
    Record<string, { subject?: string; topic: string; details: string; createdAt: string }>
  >({});

  const [localMessages, setLocalMessages] = useState<Record<string, any[]>>({});
  const [resolvedTopics, setResolvedTopics] = useState<Record<string, string[]>>({});
  const [scheduleOverrides, setScheduleOverrides] = useState<Record<string, { date: string; time: string }>>({});
  const [cancelledSessions, setCancelledSessions] = useState<Record<string, boolean>>({});
  const [readContacts, setReadContacts] = useState<Record<string, boolean>>({});

  // Raise a Doubt modal (student)
  const [isRaiseDoubtModalOpen, setIsRaiseDoubtModalOpen] = useState(false);
  const [doubtSubject, setDoubtSubject] = useState("");
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtDescription, setDoubtDescription] = useState("");

  // Request instant Meet modal (student secondary action)
  const [isInstantMeetModalOpen, setIsInstantMeetModalOpen] = useState(false);
  const [instantTopic, setInstantTopic] = useState("");
  const [instantDetails, setInstantDetails] = useState("");

  // Slot picker modal (mentor schedule / both reschedule)
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulerMode, setSchedulerMode] = useState<"schedule" | "reschedule">("schedule");
  const [schedulerTopic, setSchedulerTopic] = useState("");
  const [schedulerDate, setSchedulerDate] = useState("");
  const [schedulerSlot, setSchedulerSlot] = useState("");
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);

  const sendMessageMutation = useSendMessage();

  const pickerDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      return toISODate(d);
    });
  }, []);

  const schedulerSlots = useMemo(
    () => (schedulerDate ? getSlotsForDate(schedulerDate) : []),
    [schedulerDate]
  );

  const uniqueContacts = useMemo(() => {
    const seen = new Set<string>();
    const list: ChatContact[] = [];
    for (const c of contacts) {
      if (c && c.id && !seen.has(c.id)) {
        seen.add(c.id);
        list.push(c);
      }
    }
    return list;
  }, [contacts]);

  const subjectOptions = useMemo(() => {
    const fromTags = selectedContact?.expertiseTags?.filter(Boolean) ?? [];
    if (fromTags.length > 0) return fromTags;
    const fromCourse = selectedContact?.course?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
    if (fromCourse.length > 0) return fromCourse;
    return DEFAULT_SUBJECTS;
  }, [selectedContact]);

  // Selection initialization

  useEffect(() => {
    if (uniqueContacts.length > 0) {
      if (defaultSelectedId) {
        const matchingContact = uniqueContacts.find((c) => c.id === defaultSelectedId);
        if (matchingContact) {
          setSelectedContact(matchingContact);
          setReadContacts((prev) => ({ ...prev, [matchingContact.id]: true }));
          setIsMobileViewActive(true);
          return;
        }
      }
      if (typeof window !== "undefined" && window.innerWidth >= 768 && !selectedContact) {
        setSelectedContact(uniqueContacts[0]);
        setReadContacts((prev) => ({ ...prev, [uniqueContacts[0].id]: true }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueContacts, defaultSelectedId]);

  const { data: historyResponse, isLoading: historyLoading } = useChatHistory(
    selectedContact?.id ?? "",
    !!selectedContact
  );

  const messages = useMemo(() => {
    return historyResponse?.data?.messages ?? [];
  }, [historyResponse]);

  const mockMessages = useMemo(() => {
    let baseList = [...messages];
    const isMock = baseList.length === 0;

    if (isMock) {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const oneAndHalfHoursAgo = new Date(now.getTime() - 1.5 * 60 * 60 * 1000);

      const isStudent = role === "student";
      const studentId = isStudent ? user?._id : selectedContact?.id;
      const mentorId = isStudent ? selectedContact?.id : user?._id;

      baseList = [
        {
          _id: "mock-1",
          senderId: studentId,
          receiverId: mentorId,
          message: "Hello Mentor, I had a doubt regarding the latest bootcamp curriculum.",
          isRead: true,
          createdAt: twoHoursAgo.toISOString(),
          updatedAt: twoHoursAgo.toISOString(),
        },
        {
          _id: "mock-2",
          senderId: mentorId,
          receiverId: studentId,
          message: "Hey! Sure, what is your doubt? You can ask here, or use \"Raise a Doubt\" so I can schedule a proper 1-on-1 slot.",
          isRead: true,
          createdAt: oneAndHalfHoursAgo.toISOString(),
          updatedAt: oneAndHalfHoursAgo.toISOString(),
        },
      ];

      if (isStudent) {
        const fortyFiveMinutesAgo = new Date(now.getTime() - 45 * 60 * 1000);
        baseList.push(
          {
            _id: "mock-3",
            senderId: studentId,
            receiverId: mentorId,
            message: "[DOUBT_REQUEST] Subject: Web Development | Title: Next.js App Router | Details: I'm confused about server versus client components.",
            isRead: true,
            createdAt: fortyFiveMinutesAgo.toISOString(),
            updatedAt: fortyFiveMinutesAgo.toISOString(),
          },
          {
            _id: "mock-4",
            senderId: mentorId,
            receiverId: studentId,
            message: "[MEET_SCHEDULED] Date: 2026-08-25 | Time: 04:00 PM | Link: https://meet.google.com/gcraft-mentor-session | Topic: Next.js App Router",
            isRead: true,
            createdAt: fortyFiveMinutesAgo.toISOString(),
            updatedAt: fortyFiveMinutesAgo.toISOString(),
          }
        );
      }
    }

    // Inject active pending request card for mentor
    if (selectedContact && pendingRequests[selectedContact.id]) {
      const req = pendingRequests[selectedContact.id];
      const alreadyHasRequest = baseList.some(
        (m) =>
          (m.message?.startsWith("[MEET_REQUEST]") || m.message?.startsWith("[DOUBT_REQUEST]")) &&
          m.message?.includes(req.topic)
      );

      if (!alreadyHasRequest) {
        baseList.push({
          _id: `dynamic-req-${selectedContact.id}`,
          senderId: selectedContact.id,
          receiverId: user?._id,
          message: `[DOUBT_REQUEST] Subject: ${req.subject || "General"} | Title: ${req.topic} | Details: ${req.details}`,
          isRead: false,
          createdAt: req.createdAt,
          updatedAt: req.createdAt,
        });
      }
    }

    // Inject locally inserted cards
    if (selectedContact && localMessages[selectedContact.id]?.length) {
      baseList.push(...localMessages[selectedContact.id]);
    }

    // Drop request cards that were already resolved into scheduled sessions
    const resolved = selectedContact ? resolvedTopics[selectedContact.id] ?? [] : [];
    if (resolved.length > 0) {
      baseList = baseList.filter((m) => {
        const text: string = m.message ?? "";
        if (text.startsWith("[MEET_REQUEST]") || text.startsWith("[DOUBT_REQUEST]")) {
          const parsed = parseMessageContent(text);
          return !resolved.includes(parsed.topic || "");
        }
        return true;
      });
    }

    return baseList.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages, role, user?._id, selectedContact, pendingRequests, localMessages, resolvedTopics]);

  // Socket listener
  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleIncomingMessage = (newMsg: any) => {
      const isRequestCard =
        newMsg.message?.startsWith("[MEET_REQUEST]") || newMsg.message?.startsWith("[DOUBT_REQUEST]");

      if (isRequestCard && role === "mentor") {
        const parsed = parseMessageContent(newMsg.message);
        const sender = uniqueContacts.find((c) => c.id === newMsg.senderId);
        const senderName = sender?.name || "A student";

        toast.info(`Doubt Request from ${senderName}: "${parsed.topic}"`, {
          duration: 6000,
          action: {
            label: "Review",
            onClick: () => {
              if (sender) {
                setSelectedContact(sender);
                setReadContacts((prev) => ({ ...prev, [sender.id]: true }));
                setIsMobileViewActive(true);
              }
            },
          },
        });

        setPendingRequests((prev) => ({
          ...prev,
          [newMsg.senderId]: {
            subject: parsed.subject || "General",
            topic: parsed.topic || "Doubt Session",
            details: parsed.details || "",
            createdAt: newMsg.createdAt || new Date().toISOString(),
          },
        }));
      }

      if (selectedContact) {
        const isFromActiveContact =
          (newMsg.senderId === selectedContact.id && newMsg.receiverId === user?._id) ||
          (newMsg.senderId === user?._id && newMsg.receiverId === selectedContact.id);

        if (isFromActiveContact) {
          void queryClient.invalidateQueries({ queryKey: chatKeys.history(selectedContact.id) });
        }
      }

      // Unread indicator for other contacts
      if (newMsg.senderId && newMsg.senderId !== selectedContact?.id) {
        setReadContacts((prev) => {
          if (!prev[newMsg.senderId]) return prev;
          const next = { ...prev };
          delete next[newMsg.senderId];
          return next;
        });
      }
    };

    const handleIncomingRead = (data: any) => {
      if (selectedContact && data.readerId === selectedContact.id) {
        void queryClient.invalidateQueries({ queryKey: chatKeys.history(selectedContact.id) });
      }
    };

    socket.on("chat.message", handleIncomingMessage);
    socket.on("chat.read", handleIncomingRead);

    return () => {
      socket.off("chat.message", handleIncomingMessage);
      socket.off("chat.read", handleIncomingRead);
    };
  }, [selectedContact, user?._id, queryClient, uniqueContacts, role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mockMessages, historyLoading]);

  const filteredContacts = useMemo(() => {
    let list = uniqueContacts;
    if (activeTab === "requests") {
      list = uniqueContacts.filter((c) => !!pendingRequests[c.id]);
    }
    return list.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [uniqueContacts, searchQuery, activeTab, pendingRequests]);

  const getUnreadCount = (contact: ChatContact) =>
    readContacts[contact.id] ? 0 : contact.unreadCount ?? 0;

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    setReadContacts((prev) => ({ ...prev, [contact.id]: true }));
    setIsMobileViewActive(true);
  };

  const pushLocalCard = (contactId: string, message: string) => {
    const nowIso = new Date().toISOString();
    const card = {
      _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: user?._id,
      receiverId: contactId,
      message,
      isRead: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    setLocalMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] ?? []), card],
    }));
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedContact) return;
    const text = messageText;
    setMessageText("");
    try {
      await sendMessageMutation.mutateAsync({ receiverId: selectedContact.id, message: text });
    } catch (error) {
      console.warn("Backend chat message sync pending:", error);
    }
  };

  // 1. Raise a Doubt
  const handleRaiseDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !doubtSubject || !doubtTitle.trim()) return;

    const formatted = `[DOUBT_REQUEST] Subject: ${doubtSubject} | Title: ${doubtTitle.trim()} | Details: ${doubtDescription.trim()}`;
    pushLocalCard(selectedContact.id, formatted);
    setIsRaiseDoubtModalOpen(false);
    setDoubtSubject("");
    setDoubtTitle("");
    setDoubtDescription("");
    toast.success("Doubt request submitted. Waiting on mentor availability.");

    try {
      await sendMessageMutation.mutateAsync({ receiverId: selectedContact.id, message: formatted });
    } catch (error) {
      console.warn("Backend doubt request sync pending:", error);
    }
  };

  // 1b. Request instant Meet
  const handleRequestInstantMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !instantTopic.trim()) return;

    const formatted = `[MEET_REQUEST] Topic: ${instantTopic.trim()} | Details: ${instantDetails.trim()}`;
    pushLocalCard(selectedContact.id, formatted);
    setIsInstantMeetModalOpen(false);
    setInstantTopic("");
    setInstantDetails("");
    toast.success("Instant Meet requested.");

    try {
      await sendMessageMutation.mutateAsync({ receiverId: selectedContact.id, message: formatted });
    } catch (error) {
      console.warn("Backend instant meet sync pending:", error);
    }
  };

  // 2. Open slot picker
  const handleOpenScheduler = (topic: string) => {
    setSchedulerMode("schedule");
    setSchedulerTopic(topic);
    setRescheduleTargetId(null);
    const tomorrow = pickerDates[1] ?? pickerDates[0];
    setSchedulerDate(tomorrow);
    const firstFree = getSlotsForDate(tomorrow).find((s) => s.status === "free");
    setSchedulerSlot(firstFree?.time ?? "");
    setIsSchedulerOpen(true);
  };

  // 5. Reschedule
  const handleOpenReschedule = (messageId: string, topic: string) => {
    setSchedulerMode("reschedule");
    setSchedulerTopic(topic);
    setRescheduleTargetId(messageId);
    const target = pickerDates[1] ?? pickerDates[0];
    setSchedulerDate(target);
    const firstFree = getSlotsForDate(target).find((s) => s.status === "free");
    setSchedulerSlot(firstFree?.time ?? "");
    setIsSchedulerOpen(true);
  };

  const handleConfirmSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !schedulerDate || !schedulerSlot) return;

    if (schedulerMode === "reschedule" && rescheduleTargetId) {
      setScheduleOverrides((prev) => ({
        ...prev,
        [rescheduleTargetId]: { date: schedulerDate, time: schedulerSlot },
      }));
      setIsSchedulerOpen(false);
      toast.success(`Session moved to ${formatDateLabel(schedulerDate)}, ${schedulerSlot}.`);
      return;
    }

    const formatted = `[MEET_SCHEDULED] Date: ${schedulerDate} | Time: ${schedulerSlot} | Link: ${PENDING_LINK} | Topic: ${schedulerTopic}`;
    pushLocalCard(selectedContact.id, formatted);
    setResolvedTopics((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] ?? []), schedulerTopic],
    }));
    setPendingRequests((prev) => {
      const next = { ...prev };
      delete next[selectedContact.id];
      return next;
    });
    setIsSchedulerOpen(false);
    toast.success(`Doubt session scheduled for ${formatDateLabel(schedulerDate)}, ${schedulerSlot}.`);

    try {
      await sendMessageMutation.mutateAsync({ receiverId: selectedContact.id, message: formatted });
    } catch (error) {
      console.warn("Backend schedule sync pending:", error);
    }
  };

  // 5. Cancel session
  const handleCancelSession = (messageId: string) => {
    setCancelledSessions((prev) => ({ ...prev, [messageId]: true }));
    toast.info(role === "mentor" ? "Session cancelled." : "Cancellation request sent.");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleSend();
  };

  const availabilityNote = selectedContact?.availabilityNote || "Usually responds within 2 hrs";
  const nextFreeSlot = selectedContact?.nextFreeSlot || "Today, 4:00 PM";

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[500px] w-full rounded-2xl border border-border bg-card/65 backdrop-blur-md shadow-lg overflow-hidden">
      {/* Left Pane: Contacts List */}
      <div
        className={cn(
          "w-full md:w-80 flex flex-col border-r border-border bg-white/40 shrink-0 transition-all duration-300",
          isMobileViewActive ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${role === "student" ? "mentors" : "students"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-white/60 border-border shadow-none focus-visible:ring-magenta"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="px-4 pb-3 border-b border-border/50 bg-white/10 pt-2">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "flex-1 py-1.5 font-bold rounded-lg transition-colors border",
                activeTab === "all"
                  ? "bg-magenta text-white border-magenta shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:bg-marble"
              )}
            >
              All Chats
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={cn(
                "flex-1 py-1.5 font-bold rounded-lg transition-colors border flex items-center justify-center gap-1.5",
                activeTab === "requests"
                  ? "bg-magenta text-white border-magenta shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:bg-marble"
              )}
            >
              <span>Requests</span>
              {Object.keys(pendingRequests).length > 0 && (
                <span
                  className={cn(
                    "h-4 w-4 rounded-full text-[9px] flex items-center justify-center font-extrabold shrink-0",
                    activeTab === "requests" ? "bg-white text-magenta" : "bg-magenta text-white animate-pulse"
                  )}
                >
                  {Object.keys(pendingRequests).length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40 scrollbar-hide">
          {contactsLoading ? (
            <div className="p-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-muted/70" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-2/3 bg-muted/70 rounded" />
                    <div className="h-2 w-1/2 bg-muted/70 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : uniqueContacts.length === 0 ? (
            /* Empty state: no conversations */
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center h-full gap-2">
              <Inbox className="h-8 w-8 text-muted-foreground/50" />
              <p className="font-semibold text-foreground">No conversations yet</p>
              <p className="text-xs max-w-[15rem]">
                {role === "student"
                  ? "Once a mentor is assigned to your cohort, your doubt chats will show up here."
                  : "Students assigned to your cohorts will appear here when they join."}
              </p>
            </div>
          ) : filteredContacts.length === 0 ? (
            /* Empty state: no match */
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center h-full gap-2">
              <Search className="h-8 w-8 text-muted-foreground/50" />
              <p className="font-semibold text-foreground">No matching conversations</p>
              <p className="text-xs">
                {activeTab === "requests" ? "No pending doubt requests right now." : "Try a different search."}
              </p>
            </div>
          ) : (
            filteredContacts.map((contact, index) => {
              const active = selectedContact?.id === contact.id;
              const initials = contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const unread = getUnreadCount(contact);
              const activeTopic = pendingRequests[contact.id]?.topic || contact.activeDoubtTopic;

              return (
                <button
                  key={contact.id || `contact-${index}`}
                  onClick={() => handleSelectContact(contact)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 text-left transition-all hover:bg-magenta/5 border-l-4",
                    active ? "bg-magenta/5 border-magenta" : "border-transparent bg-transparent"
                  )}
                >
                  <div className="h-10 w-10 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold text-xs shrink-0 relative">
                    {initials}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <span className={cn("text-sm text-foreground truncate block", unread > 0 ? "font-extrabold" : "font-semibold")}>
                        {contact.name}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        {pendingRequests[contact.id] && (
                          <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-md animate-pulse shrink-0">
                            Doubt Req
                          </span>
                        )}
                        {/* 5. Unread badge */}
                        {unread > 0 && (
                          <span className="h-4 min-w-[1rem] px-1 rounded-full bg-magenta text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Expertise / Batch tag — muted font with icon */}
                    {contact.course && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal w-max max-w-full">
                        <Tag className="h-2.5 w-2.5 shrink-0 opacity-70" />
                        <span className="truncate">{contact.course}</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Chat */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white/60 transition-all duration-300",
          !isMobileViewActive ? "hidden md:flex" : "flex"
        )}
      >
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-white/50 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileViewActive(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold text-xs shrink-0">
                  {selectedContact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-tight">{selectedContact.name}</h4>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Mentor availability strip (student side only) */}
            {role === "student" && (
              <div className="px-4 py-2 border-b border-border/60 bg-lavender/10 flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3 w-3 shrink-0" />
                  {availabilityNote}
                </span>
                <span className="text-[11px] font-semibold text-magenta flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  Next free slot: {nextFreeSlot}
                </span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-marble/20 scrollbar-hide">
              {historyLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-8 w-8 rounded-full border-2 border-magenta/30 border-t-magenta animate-spin" />
                </div>
              ) : mockMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/30 animate-bounce" />
                  <p className="text-xs">Send your first message to start the conversation.</p>
                </div>
              ) : (
                mockMessages.map((message: any, index: number) => {
                  const isOwn = message.senderId === user?._id;
                  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const parsed = parseMessageContent(message.message);
                  const cardId: string = message._id || `msg-${index}`;
                  const override = scheduleOverrides[cardId];
                  const cardDate = override?.date ?? parsed.date;
                  const cardTime = override?.time ?? parsed.time;
                  const isCancelled = !!cancelledSessions[cardId];
                  const isLinkReady = !!parsed.link && parsed.link !== PENDING_LINK && !isCancelled;

                  return (
                    <div
                      key={cardId}
                      className={cn(
                        "flex flex-col w-[85%] md:w-[70%]",
                        isOwn ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      {/* Plain text bubble */}
                      {parsed.type === "text" && (
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed whitespace-pre-wrap break-words w-max max-w-full",
                            isOwn
                              ? "bg-magenta text-white rounded-tr-none"
                              : "bg-white border border-border text-foreground rounded-tl-none"
                          )}
                        >
                          {parsed.text}
                        </div>
                      )}

                      {/* 1. Doubt Request Submitted card */}
                      {parsed.type === "doubt_request" && (
                        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3 rounded-tl-none w-full border-l-4 border-l-amber-500">
                          <div className="flex items-start gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <HelpCircle className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wide">
                                Doubt Request Submitted
                              </h5>
                              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{parsed.topic}</p>
                              {parsed.subject && (
                                <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <Tag className="h-2.5 w-2.5 opacity-70" />{parsed.subject}
                                </span>
                              )}
                              {parsed.details && (
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap">{parsed.details}</p>
                              )}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-4">
                            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Pending Mentor Availability
                            </span>
                            {!isOwn && role === "mentor" && (
                              <Button
                                size="sm"
                                type="button"
                                onClick={() => handleOpenScheduler(parsed.topic || "")}
                                className="bg-magenta hover:bg-magenta/90 text-white text-xs h-7 px-3 py-1 shadow-none"
                              >
                                Accept &amp; Schedule
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 1b. Instant Meet request card */}
                      {parsed.type === "meet_request" && (
                        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3 rounded-tl-none w-full border-l-4 border-l-sky-500">
                          <div className="flex items-start gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                              <Video className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wide">
                                Instant Meet Requested
                              </h5>
                              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{parsed.topic}</p>
                              {parsed.details && (
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap">{parsed.details}</p>
                              )}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-4">
                            <span className="text-[10px] text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                              Awaiting mentor response
                            </span>
                            {!isOwn && role === "mentor" && (
                              <Button
                                size="sm"
                                type="button"
                                onClick={() => handleOpenScheduler(parsed.topic || "")}
                                className="bg-magenta hover:bg-magenta/90 text-white text-xs h-7 px-3 py-1 shadow-none"
                              >
                                Accept &amp; Schedule
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 2. Scheduled Session card */}
                      {parsed.type === "meet_scheduled" && (
                        <div
                          className={cn(
                            "rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3 rounded-tl-none w-full border-l-4",
                            isCancelled ? "border-l-red-400" : "border-l-green-500"
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                isCancelled ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                              )}
                            >
                              <Calendar className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wide">
                                {isCancelled ? "Doubt Session Cancelled" : "Doubt Session Scheduled"}
                              </h5>
                              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{parsed.topic}</p>
                              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                <p className="flex items-center gap-1.5">
                                  <span className="font-medium text-foreground">Date:</span> {formatDateLabel(cardDate)}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <span className="font-medium text-foreground">Time:</span> {cardTime}
                                </p>
                              </div>
                            </div>

                            {/* 5. Cancel / Reschedule dropdown */}
                            {!isCancelled && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem onClick={() => handleOpenReschedule(cardId, parsed.topic || "")} className="text-xs cursor-pointer">
                                    <Calendar className="h-3.5 w-3.5 mr-2" />
                                    Reschedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCancelSession(cardId)} className="text-xs cursor-pointer text-red-600 focus:text-red-600">
                                    <X className="h-3.5 w-3.5 mr-2" />
                                    Cancel session
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-4">
                            {isCancelled ? (
                              <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Cancelled
                              </span>
                            ) : (
                              <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                {override ? "Rescheduled" : "Scheduled"}
                              </span>
                            )}

                            {isLinkReady ? (
                              <a
                                href={parsed.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-none transition-colors"
                              >
                                Join Google Meet
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-none cursor-not-allowed opacity-70"
                              >
                                Join Google Meet
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-muted-foreground mt-1 px-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {time}
                        {isOwn && (
                          <span className="ml-1 shrink-0">
                            {message.isRead ? (
                              <CheckCheck className="h-3 w-3 text-sky-500 shrink-0" />
                            ) : (
                              <Check className="h-3 w-3 text-muted-foreground shrink-0" />
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-white/50 flex items-center gap-2 shrink-0">
              {role === "student" && (
                <>
                  {/* 1. Primary: Raise a Doubt */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRaiseDoubtModalOpen(true)}
                    className="shrink-0 h-9 border-magenta/40 text-magenta hover:bg-magenta/5 hover:text-magenta font-semibold text-xs px-2.5 md:px-3"
                    title="Raise a structured doubt"
                  >
                    <HelpCircle className="h-4 w-4 md:mr-1.5" />
                    <span className="hidden md:inline">Raise a Doubt</span>
                  </Button>

                  {/* 1b. Secondary: Request instant Meet */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsInstantMeetModalOpen(true)}
                    className="text-muted-foreground hover:text-magenta hover:bg-magenta/5 shrink-0 h-9 w-9 rounded-lg"
                    title="Request instant Meet"
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                </>
              )}

              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sendMessageMutation.isPending}
                className="flex-1 bg-white border-border focus-visible:ring-magenta shadow-none"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="bg-magenta hover:bg-magenta/90 text-white shrink-0 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          /* 5. Empty state — no conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-3">
            <div className="h-16 w-16 rounded-full bg-magenta/5 flex items-center justify-center text-magenta">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-foreground">Select a conversation to start chatting</h3>
            <p className="text-sm max-w-sm">
              Pick a {role === "student" ? "mentor" : "student"} from the list to open the 1-to-1 doubt session thread.
            </p>
          </div>
        )}
      </div>

      {/* 1. Raise a Doubt Modal (Student) */}
      <Dialog open={isRaiseDoubtModalOpen} onOpenChange={setIsRaiseDoubtModalOpen}>
        <DialogContent className="sm:max-w-lg w-full p-6 rounded-2xl bg-white border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Raise a Doubt</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRaiseDoubt} className="space-y-4 pt-1 w-full min-w-0">
            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="doubt-subject" className="text-xs font-semibold text-foreground">Subject Area</Label>
              <Select value={doubtSubject} onValueChange={setDoubtSubject}>
                <SelectTrigger id="doubt-subject" className="w-full h-9 text-xs rounded-xl bg-white">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {subjectOptions.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-xs">{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Tied to your mentor&apos;s expertise tags.
              </p>
            </div>
            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="doubt-title" className="text-xs font-semibold text-foreground">Doubt Title</Label>
              <Input
                id="doubt-title"
                placeholder="e.g. Server vs client components in App Router"
                value={doubtTitle}
                onChange={(e) => setDoubtTitle(e.target.value)}
                maxLength={90}
                required
                className="h-9 text-xs rounded-xl bg-white"
              />
            </div>
            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="doubt-description" className="text-xs font-semibold text-foreground">Description</Label>
              <Textarea
                id="doubt-description"
                placeholder="Explain what you tried and where you are stuck..."
                value={doubtDescription}
                onChange={(e) => setDoubtDescription(e.target.value)}
                className="h-24 resize-none text-xs rounded-xl bg-white"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsRaiseDoubtModalOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!doubtSubject || !doubtTitle.trim()} className="bg-magenta hover:bg-magenta/90 text-white rounded-xl text-xs font-semibold shadow-sm">
                Submit Doubt
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 1b. Request Instant Meet Modal (Student) */}
      <Dialog open={isInstantMeetModalOpen} onOpenChange={setIsInstantMeetModalOpen}>
        <DialogContent className="sm:max-w-lg w-full p-6 rounded-2xl bg-white border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Request Instant Meet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestInstantMeet} className="space-y-4 pt-1 w-full min-w-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use this when you need your mentor on a call right now. For anything that can wait, raise a doubt instead.
            </p>
            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="instant-topic" className="text-xs font-semibold text-foreground">What do you need help with?</Label>
              <Input
                id="instant-topic"
                placeholder="e.g. Build failing before submission deadline"
                value={instantTopic}
                onChange={(e) => setInstantTopic(e.target.value)}
                required
                className="h-9 text-xs rounded-xl bg-white"
              />
            </div>
            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="instant-details" className="text-xs font-semibold text-foreground">Extra context (optional)</Label>
              <Textarea
                id="instant-details"
                placeholder="Error details, deadline, etc."
                value={instantDetails}
                onChange={(e) => setInstantDetails(e.target.value)}
                className="h-20 resize-none text-xs rounded-xl bg-white"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsInstantMeetModalOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!instantTopic.trim()} className="bg-magenta hover:bg-magenta/90 text-white rounded-xl text-xs font-semibold shadow-sm">
                Send Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2 & 5. Slot Picker Modal (Schedule / Reschedule) */}
      <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
        <DialogContent className="sm:max-w-lg w-full p-6 rounded-2xl bg-white border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {schedulerMode === "reschedule" ? "Reschedule Doubt Session" : "Pick a Date & Time"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConfirmSlot} className="space-y-4 pt-1 w-full min-w-0">
            {/* Topic preview box */}
            <div className="space-y-1 w-full min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Topic</p>
              <div className="text-xs sm:text-sm font-semibold text-foreground bg-marble/70 px-3.5 py-2.5 rounded-xl border border-border/80 break-words line-clamp-2">
                {schedulerTopic || "Doubt Session"}
              </div>
            </div>

            {/* Date selection row */}
            <div className="space-y-1.5 w-full min-w-0">
              <Label className="text-xs font-semibold text-foreground">Select Date</Label>
              <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin w-full max-w-full">
                {pickerDates.map((date, i) => {
                  const d = new Date(`${date}T00:00:00`);
                  const isActive = schedulerDate === date;
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => {
                        setSchedulerDate(date);
                        const firstFree = getSlotsForDate(date).find((s) => s.status === "free");
                        setSchedulerSlot(firstFree?.time ?? "");
                      }}
                      className={cn(
                        "shrink-0 w-14 sm:w-16 py-2 px-1 rounded-xl border text-center transition-all",
                        isActive
                          ? "bg-magenta text-white border-magenta shadow-sm font-bold ring-2 ring-magenta/20"
                          : "bg-white text-foreground border-border hover:bg-marble hover:border-border/80"
                      )}
                    >
                      <span className={cn("block text-[9px] uppercase tracking-wide font-medium", isActive ? "text-white/90" : "text-muted-foreground")}>
                        {i === 0 ? "Today" : d.toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                      <span className="block text-sm font-bold leading-tight mt-0.5">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots section */}
            <div className="space-y-2 w-full min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <Label className="text-xs font-semibold text-foreground">Slots on {formatDateLabel(schedulerDate)}</Label>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Free</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Busy</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                {schedulerSlots.map((slot) => {
                  const isBusy = slot.status === "busy";
                  const isActive = schedulerSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setSchedulerSlot(slot.time)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all text-center truncate",
                        isBusy && "bg-marble/80 text-muted-foreground/40 border-border/60 line-through cursor-not-allowed",
                        !isBusy && isActive && "bg-magenta text-white border-magenta shadow-sm ring-2 ring-magenta/20",
                        !isBusy && !isActive && "bg-white text-foreground border-border hover:bg-magenta/5 hover:border-magenta/40"
                      )}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground/80 leading-normal">
                Free/busy data is placeholder — will sync with Google Calendar once backend is connected.
              </p>
            </div>

            {/* Disclaimer box */}
            <div className="rounded-xl border border-border/80 bg-marble/60 px-3.5 py-2.5 w-full min-w-0">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                A Google Meet link will be auto-generated after backend integration. Until then the Join button stays disabled.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsSchedulerOpen(false)} className="rounded-xl text-xs px-4">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!schedulerDate || !schedulerSlot} className="bg-magenta hover:bg-magenta/90 text-white rounded-xl text-xs font-bold px-5 shadow-sm">
                {schedulerMode === "reschedule" ? "Confirm New Slot" : "Confirm Slot"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
