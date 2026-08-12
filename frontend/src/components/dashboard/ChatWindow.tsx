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

export interface ChatContact {
  id: string; // User ID
  name: string;
  avatar?: string;
  role?: string;
  course?: string; // Batch/Course information
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
  type: "text" | "meet_request" | "meet_scheduled";
  text?: string;
  topic?: string;
  details?: string;
  date?: string;
  time?: string;
  link?: string;
}

const parseMessageContent = (msgText: string): ParsedMessage => {
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

  // Tabs filters: all conversations vs doubt requests
  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  // Track pending meeting/doubt requests per contact ID
  const [pendingRequests, setPendingRequests] = useState<
    Record<string, { topic: string; details: string; createdAt: string }>
  >({});

  // Modals States
  const [isRequestMeetModalOpen, setIsRequestMeetModalOpen] = useState(false);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestDetails, setRequestDetails] = useState("");

  const [isScheduleMeetModalOpen, setIsScheduleMeetModalOpen] = useState(false);
  const [scheduleTopic, setScheduleTopic] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleLink, setScheduleLink] = useState("https://meet.google.com/gcraft-mentor-session");

  const sendMessageMutation = useSendMessage();

  // Populate mock pending requests for demo/test purposes
  useEffect(() => {
    if (contacts.length > 0 && role === "mentor") {
      const firstStudent = contacts[0];
      setPendingRequests((prev) => ({
        ...prev,
        [firstStudent.id]: {
          topic: "React Query Cache Invalidation",
          details: "Need advice on invalidating list caches when adding progress notes manually in offline sessions.",
          createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        },
      }));
    }
  }, [contacts, role]);

  // Set default selected contact from query parameter or first contact
  useEffect(() => {
    if (contacts.length > 0) {
      if (defaultSelectedId) {
        const matchingContact = contacts.find((c) => c.id === defaultSelectedId);
        if (matchingContact) {
          setSelectedContact(matchingContact);
          setIsMobileViewActive(true);
          return;
        }
      }
      // If no default but we are on desktop, select first contact automatically
      if (typeof window !== "undefined" && window.innerWidth >= 768 && !selectedContact) {
        setSelectedContact(contacts[0]);
      }
    }
  }, [contacts, defaultSelectedId]);

  // Fetch messages for selected contact
  const { data: historyResponse, isLoading: historyLoading } = useChatHistory(
    selectedContact?.id ?? "",
    !!selectedContact
  );

  const messages = useMemo(() => {
    return historyResponse?.data?.messages ?? [];
  }, [historyResponse]);

  // Fallback Dummy Data + Dynamic Request injection
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
          message: "Hey! Sure, what is your doubt? You can ask here or send a Meet request using the video icon next to the input.",
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
            message: "[MEET_REQUEST] Topic: Next.js App Router | Details: I'm confused about server versus client components.",
            isRead: true,
            createdAt: fortyFiveMinutesAgo.toISOString(),
            updatedAt: fortyFiveMinutesAgo.toISOString(),
          },
          {
            _id: "mock-4",
            senderId: mentorId,
            receiverId: studentId,
            message: "[MEET_SCHEDULED] Date: 2026-08-15 | Time: 04:00 PM | Link: https://meet.google.com/gcraft-mentor-session | Topic: Next.js App Router",
            isRead: true,
            createdAt: fortyFiveMinutesAgo.toISOString(),
            updatedAt: fortyFiveMinutesAgo.toISOString(),
          }
        );
      }
    }

    // Inject active pending request card if it exists in state
    if (selectedContact && pendingRequests[selectedContact.id]) {
      const req = pendingRequests[selectedContact.id];
      const alreadyHasRequest = baseList.some(
        (m) => m.message?.startsWith("[MEET_REQUEST]") && m.message?.includes(req.topic)
      );

      if (!alreadyHasRequest) {
        baseList.push({
          _id: `dynamic-req-${selectedContact.id}`,
          senderId: selectedContact.id, // Sent by student (the other contact)
          receiverId: user?._id,
          message: `[MEET_REQUEST] Topic: ${req.topic} | Details: ${req.details}`,
          isRead: false,
          createdAt: req.createdAt,
          updatedAt: req.createdAt,
        });
      }
    }

    return baseList.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages, role, user?._id, selectedContact?.id, pendingRequests]);

  // Socket listener for real-time messages & requests
  useEffect(() => {
    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleIncomingMessage = (newMsg: any) => {
      console.log("[ChatWindow] Real-time message received:", newMsg);

      // Notify mentor if an incoming message is a new doubt request
      if (newMsg.message?.startsWith("[MEET_REQUEST]") && role === "mentor") {
        const parsed = parseMessageContent(newMsg.message);
        const sender = contacts.find((c) => c.id === newMsg.senderId);
        const senderName = sender?.name || "A student";

        toast.info(`🔔 Doubt Request from ${senderName}: "${parsed.topic}"`, {
          duration: 6000,
          action: {
            label: "Review",
            onClick: () => {
              if (sender) {
                setSelectedContact(sender);
                setIsMobileViewActive(true);
              }
            },
          },
        });

        // Add to active pending requests state
        setPendingRequests((prev) => ({
          ...prev,
          [newMsg.senderId]: {
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
          void queryClient.invalidateQueries({
            queryKey: chatKeys.history(selectedContact.id),
          });
        }
      }
    };

    socket.on("chat.message", handleIncomingMessage);

    return () => {
      socket.off("chat.message", handleIncomingMessage);
    };
  }, [selectedContact, user?._id, queryClient, contacts, role]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mockMessages, historyLoading]);

  // Filter contacts by search query & tab
  const filteredContacts = useMemo(() => {
    let list = contacts;
    if (activeTab === "requests") {
      list = contacts.filter((c) => !!pendingRequests[c.id]);
    }
    return list.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery, activeTab, pendingRequests]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedContact) return;

    const text = messageText;
    setMessageText("");

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: selectedContact.id,
        message: text,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendMeetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopic.trim() || !selectedContact) return;

    const formattedRequest = `[MEET_REQUEST] Topic: ${requestTopic.trim()} | Details: ${requestDetails.trim()}`;
    setRequestTopic("");
    setRequestDetails("");
    setIsRequestMeetModalOpen(false);

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: selectedContact.id,
        message: formattedRequest,
      });

      // Mark locally as pending
      setPendingRequests((prev) => ({
        ...prev,
        [selectedContact.id]: {
          topic: requestTopic.trim(),
          details: requestDetails.trim(),
          createdAt: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error("Failed to send meet request:", error);
    }
  };

  const handleScheduleMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime || !selectedContact) return;

    const formattedSchedule = `[MEET_SCHEDULED] Date: ${scheduleDate} | Time: ${scheduleTime} | Link: ${scheduleLink.trim()} | Topic: ${scheduleTopic}`;
    setScheduleDate("");
    setScheduleTime("");
    setIsScheduleMeetModalOpen(false);

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: selectedContact.id,
        message: formattedSchedule,
      });

      // Clear pending state upon confirmation
      setPendingRequests((prev) => {
        const next = { ...prev };
        delete next[selectedContact.id];
        return next;
      });
    } catch (error) {
      console.error("Failed to send scheduled meet:", error);
    }
  };

  const handleOpenScheduleModal = (topic: string) => {
    setScheduleTopic(topic);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split("T")[0]);
    setScheduleTime("11:00 AM");
    setIsScheduleMeetModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSend();
    }
  };

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
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center h-full gap-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const active = selectedContact?.id === contact.id;
              const initials = contact.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setIsMobileViewActive(true);
                  }}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 text-left transition-all hover:bg-magenta/5 border-l-4",
                    active
                      ? "bg-magenta/5 border-magenta"
                      : "border-transparent bg-transparent"
                  )}
                >
                  <div className="h-10 w-10 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold text-xs shrink-0 relative">
                    {initials}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <span className="font-semibold text-sm text-foreground truncate block">
                        {contact.name}
                      </span>
                      {pendingRequests[contact.id] && (
                        <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-md animate-pulse shrink-0">
                          Doubt Req
                        </span>
                      )}
                    </div>
                    {contact.course && (
                      <span className="text-[10px] bg-lavender/25 text-magenta font-semibold px-1.5 py-0.5 rounded truncate block w-max max-w-full">
                        {contact.course}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Chat Window */}
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
                  {selectedContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-tight">
                    {selectedContact.name}
                  </h4>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

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
                mockMessages.map((message: any) => {
                  const isOwn = message.senderId === user?._id;
                  const time = new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const parsed = parseMessageContent(message.message);

                  return (
                    <div
                      key={message._id}
                      className={cn(
                        "flex flex-col w-[85%] md:w-[70%]",
                        isOwn ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
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

                      {parsed.type === "meet_request" && (
                        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3 rounded-tl-none w-full border-l-4 border-l-amber-500">
                          <div className="flex items-start gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <Video className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wide">
                                Doubt Request Submitted
                              </h5>
                              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                                {parsed.topic}
                              </p>
                              {parsed.details && (
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap">
                                  {parsed.details}
                                </p>
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
                                onClick={() => handleOpenScheduleModal(parsed.topic || "")}
                                className="bg-magenta hover:bg-magenta/90 text-white text-xs h-7.5 px-3 py-1 shadow-none"
                              >
                                Accept & Schedule
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {parsed.type === "meet_scheduled" && (
                        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3 rounded-tl-none w-full border-l-4 border-l-green-500">
                          <div className="flex items-start gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                              <Calendar className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wide">
                                Doubt Session Scheduled
                              </h5>
                              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                                {parsed.topic}
                              </p>
                              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                <p className="flex items-center gap-1.5">
                                  <span className="font-medium text-foreground">Date:</span> {parsed.date}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <span className="font-medium text-foreground">Time:</span> {parsed.time}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-4">
                            <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Scheduled
                            </span>

                            {parsed.link && (
                              <a
                                href={parsed.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold h-7.5 px-3 py-1.5 rounded-md flex items-center gap-1 shadow-none transition-colors"
                              >
                                Join Google Meet
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-muted-foreground mt-1 px-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {time}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-border bg-white/50 flex items-center gap-2 shrink-0"
            >
              {/* Meet Request Trigger Button (Students Only) */}
              {role === "student" && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsRequestMeetModalOpen(true)}
                  className="text-muted-foreground hover:text-magenta hover:bg-magenta/5 shrink-0 h-9 w-9 rounded-lg"
                  title="Request a Google Meet Session"
                >
                  <Video className="h-5 w-5" />
                </Button>
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
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-3">
            <div className="h-16 w-16 rounded-full bg-magenta/5 flex items-center justify-center text-magenta">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-foreground">No Doubt Session Selected</h3>
            <p className="text-sm max-w-sm">
              Select a {role === "student" ? "mentor" : "student"} from the list to start a 1-to-1 doubt session.
            </p>
          </div>
        )}
      </div>

      {/* Student Request Meet Modal */}
      <Dialog open={isRequestMeetModalOpen} onOpenChange={setIsRequestMeetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request a Google Meet Session</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendMeetRequest} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="meet-topic" className="text-xs">Doubt Topic</Label>
              <Input
                id="meet-topic"
                placeholder="e.g. Next.js server actions, Resume review"
                value={requestTopic}
                onChange={(e) => setRequestTopic(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meet-details" className="text-xs">Doubt Details / Program Questions</Label>
              <Textarea
                id="meet-details"
                placeholder="Describe your questions or what you want to cover..."
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="h-24 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRequestMeetModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!requestTopic.trim() || sendMessageMutation.isPending}
                className="bg-magenta hover:bg-magenta/90 text-white"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mentor Schedule Meet Modal */}
      <Dialog open={isScheduleMeetModalOpen} onOpenChange={setIsScheduleMeetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Availability & Meet Link</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleMeet} className="space-y-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Topic</p>
              <p className="text-sm font-semibold text-foreground bg-marble/60 px-3 py-2 rounded-lg border border-border">
                {scheduleTopic}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="meet-date" className="text-xs">Date</Label>
                <Input
                  id="meet-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meet-time" className="text-xs">Time Slot</Label>
                <Input
                  id="meet-time"
                  placeholder="e.g. 11:00 AM, 03:30 PM"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meet-link" className="text-xs">Google Meet Link</Label>
              <Input
                id="meet-link"
                value={scheduleLink}
                onChange={(e) => setScheduleLink(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsScheduleMeetModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!scheduleDate || !scheduleTime || sendMessageMutation.isPending}
                className="bg-magenta hover:bg-magenta/90 text-white"
              >
                Schedule & Confirm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
