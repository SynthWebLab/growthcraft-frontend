/**
 * Mock detailed data for ALL Events (Workshops, Bootcamps, Hackathons)
 * Auto-generates from existing mock data
 */

import type { EventDetailResponse } from "@/types/event";
import { MOCK_WORKSHOPS, MOCK_HACKATHONS } from "./events.mock";
import { bootcampsMock } from "./bootcamps.mock";

// Helper to generate detailed event data from list data
function generateEventDetail(
  event: any,
  type: "Workshop" | "Bootcamp" | "Hackathon"
): EventDetailResponse {
  const isWorkshop = type === "Workshop";
  const isBootcamp = type === "Bootcamp";
  const isHackathon = type === "Hackathon";

  return {
    success: true,
    message: "Event details fetched successfully",
    data: {
      event: {
        _id: event.id || event._id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        type,
        category: event.domain || "General",
        level: "Intermediate" as any,
        duration: isWorkshop
          ? parseInt(event.duration)
          : isBootcamp
          ? 504 // 12 weeks
          : parseInt(event.duration),
        price: event.price || 0,
        mode: event.mode,
        venue:
          event.mode === "Offline" || event.mode === "Hybrid"
            ? {
                name: `${event.location} Training Center`,
                address: `123 Tech Street, ${event.location}`,
                city: event.location,
                state: "India",
                googleMapsLink: `https://maps.google.com/?q=${event.location}`,
              }
            : undefined,
        startDate: isWorkshop
          ? `${event.startDate}T${event.startTime.replace(" ", "").toLowerCase() === "10:00am" ? "10:00:00Z" : "14:00:00Z"}`
          : `${event.startDate}T09:00:00Z`,
        endDate: isWorkshop
          ? `${event.endDate}T${event.endTime.replace(" ", "").toLowerCase() === "4:00pm" ? "16:00:00Z" : "18:00:00Z"}`
          : `${event.endDate}T18:00:00Z`,
        maxSeats: event.maxSeats || 50,
        enrolledCount: event.enrolledCount || 0,
        status: event.status === "Open" ? "Active" : (event.status as any),
        rating: 4.7 + Math.random() * 0.3,
        tools: event.keyTools || event.skillsCovered || [],
        mentorName:
          Array.isArray(event.mentorNames)
            ? event.mentorNames.join(", ")
            : "Industry Expert",
        primaryCTA:
          event.status === "Open"
            ? isBootcamp
              ? "Reserve Seat"
              : "Register Now"
            : "Request Callback",
        secondaryCTA: event.status === "Open" ? "Request Callback" : null,
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-05-15T00:00:00Z",
      },
      overview: {
        aboutEvent: `${event.description} This ${type.toLowerCase()} provides hands-on experience with industry-standard tools and real-world scenarios. Perfect for developers looking to level up their skills.`,
        whatYouWillLearn: (event.keyTools || event.skillsCovered || []).map(
          (tool: string, idx: number) => ({
            text: `Master ${tool} from basics to advanced`,
            _id: `learn-${idx}`,
          })
        ),
        prerequisites: [
          { text: "Basic programming knowledge", _id: "prereq-1" },
          { text: "Laptop with required software", _id: "prereq-2" },
          { text: "Enthusiasm to learn", _id: "prereq-3" },
        ],
        whatsIncluded: [
          {
            text: isBootcamp
              ? "12 weeks of intensive training"
              : `${event.duration} of focused learning`,
            icon: "clock",
            _id: "inc-1",
          },
          { text: "Hands-on projects", icon: "code", _id: "inc-2" },
          { text: "Expert mentorship", icon: "users", _id: "inc-3" },
          { text: "Certificate of completion", icon: "certificate", _id: "inc-4" },
          ...(isHackathon && event.prizePool
            ? [{ text: `Prize pool: ${event.prizePool}`, icon: "trophy", _id: "inc-5" }]
            : []),
        ],
      },
      agenda: isBootcamp
        ? [
            {
              sessionNumber: 1,
              title: "Weeks 1-3: Foundations",
              duration: 126,
              topics: (event.skillsCovered || []).slice(0, 3).map((skill: string, idx: number) => ({
                text: `${skill} fundamentals`,
                _id: `topic-1-${idx}`,
              })),
              _id: "agenda-1",
            },
            {
              sessionNumber: 2,
              title: "Weeks 4-6: Advanced Concepts",
              duration: 126,
              topics: (event.skillsCovered || []).slice(3, 6).map((skill: string, idx: number) => ({
                text: `Advanced ${skill}`,
                _id: `topic-2-${idx}`,
              })),
              _id: "agenda-2",
            },
            {
              sessionNumber: 3,
              title: "Weeks 7-9: Real Projects",
              duration: 126,
              topics: [
                { text: "Project planning and setup", _id: "topic-3-1" },
                { text: "Building production applications", _id: "topic-3-2" },
                { text: "Code reviews and best practices", _id: "topic-3-3" },
              ],
              _id: "agenda-3",
            },
            {
              sessionNumber: 4,
              title: "Weeks 10-12: Deployment & Career",
              duration: 126,
              topics: [
                { text: "Deployment strategies", _id: "topic-4-1" },
                { text: "Portfolio building", _id: "topic-4-2" },
                { text: "Interview preparation", _id: "topic-4-3" },
              ],
              _id: "agenda-4",
            },
          ]
        : [
            {
              sessionNumber: 1,
              title: "Introduction & Setup",
              duration: isWorkshop ? 60 : 120,
              topics: [
                { text: "Welcome and overview", _id: "topic-1" },
                { text: "Environment setup", _id: "topic-2" },
              ],
              _id: "agenda-1",
            },
            {
              sessionNumber: 2,
              title: "Core Concepts",
              duration: isWorkshop ? 120 : 240,
              topics: (event.keyTools || event.skillsCovered || []).map(
                (tool: string, idx: number) => ({
                  text: `Working with ${tool}`,
                  _id: `topic-${idx}`,
                })
              ),
              _id: "agenda-2",
            },
            {
              sessionNumber: 3,
              title: "Hands-on Practice",
              duration: isWorkshop ? 90 : 180,
              topics: [
                { text: "Build real projects", _id: "practice-1" },
                { text: "Problem-solving exercises", _id: "practice-2" },
              ],
              _id: "agenda-3",
            },
            {
              sessionNumber: 4,
              title: isHackathon ? "Final Presentations" : "Wrap-up & Q&A",
              duration: isWorkshop ? 60 : 120,
              topics: [
                { text: isHackathon ? "Project demos" : "Review and recap", _id: "final-1" },
                { text: isHackathon ? "Winner announcement" : "Q&A session", _id: "final-2" },
              ],
              _id: "agenda-4",
            },
          ],
      mentorDetails: {
        name:
          Array.isArray(event.mentorNames) && event.mentorNames.length > 0
            ? event.mentorNames[0]
            : "Industry Expert",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Array.isArray(event.mentorNames) ? event.mentorNames[0] : "expert"}`,
        bio: "Experienced professional with years of industry expertise. Passionate about teaching and mentoring the next generation of developers.",
        rating: 4.8,
        studentsCount: Math.floor(Math.random() * 2000) + 500,
        expertise: event.keyTools || event.skillsCovered || [],
      },
      faqs: [
        {
          question: `What is the ${type.toLowerCase()} schedule?`,
          answer: isBootcamp
            ? "The bootcamp runs for 12 weeks with a mix of online sessions and practical projects."
            : `The ${type.toLowerCase()} is scheduled for ${event.duration} starting ${event.startDate}.`,
          _id: "faq-1",
        },
        {
          question: "Will I get a certificate?",
          answer: `Yes! You'll receive a certificate of completion after successfully finishing the ${type.toLowerCase()}.`,
          _id: "faq-2",
        },
        {
          question: isBootcamp ? "Is placement assistance provided?" : "Is this recorded?",
          answer: isBootcamp
            ? "Yes, we provide placement assistance including resume building and interview preparation."
            : isWorkshop
            ? "Yes, all sessions are recorded and you'll have lifetime access."
            : "Highlights and winner announcements will be recorded.",
          _id: "faq-3",
        },
      ],
    },
    meta: {
      timestamp: "2026-06-01T00:00:00Z",
    },
  };
}

// Build the complete mock data object
const mockData: Record<string, EventDetailResponse> = {};

// Add all workshops
MOCK_WORKSHOPS.forEach((workshop) => {
  mockData[workshop.slug] = generateEventDetail(workshop, "Workshop");
});

// Add all hackathons
MOCK_HACKATHONS.forEach((hackathon) => {
  mockData[hackathon.slug] = generateEventDetail(hackathon, "Hackathon");
});

// Add all bootcamps
bootcampsMock.forEach((bootcamp) => {
  mockData[bootcamp.slug] = generateEventDetail(bootcamp, "Bootcamp");
});

// Export the complete mock data
export { mockData as EVENTS_DETAIL_MOCK };

// Helper to get event detail by slug
export function getEventDetailBySlug(slug: string): EventDetailResponse | null {
  return mockData[slug] || null;
}
