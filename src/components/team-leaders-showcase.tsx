"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { Users, Crown, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type { Team } from "@/lib/types";

interface TeamLeadersShowcaseProps {
  teams: Team[];
}

// Team color mappings (matching live-score-pulse)
const TEAM_COLORS: Record<string, { primary: string; gradient: string; light: string }> = {
  SAMARQAND: {
    primary: "#D72638",
    gradient: "from-[#D72638] to-[#B01E2E]",
    light: "#FEE2E2",
  },
  NAHAVAND: {
    primary: "#1E3A8A",
    gradient: "from-[#1E3A8A] to-[#172554]",
    light: "#DBEAFE",
  },
  YAMAMA: {
    primary: "#7C3AED",
    gradient: "from-[#7C3AED] to-[#6D28D9]",
    light: "#EDE9FE",
  },
  QURTUBA: {
    primary: "#FACC15",
    gradient: "from-[#FACC15] to-[#EAB308]",
    light: "#FEF9C3",
  },
  MUQADDAS: {
    primary: "#059669",
    gradient: "from-[#059669] to-[#047857]",
    light: "#D1FAE5",
  },
  BUKHARA: {
    primary: "#FB923C",
    gradient: "from-[#FB923C] to-[#F97316]",
    light: "#FFEDD5",
  },
};

function parseLeaders(leaderString: string): string[] {
  // Handle multiple leaders separated by &, and, or comma
  return leaderString
    .split(/[&,]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  // Check if it's a valid URL (starts with http/https) or a relative path (starts with /)
  return /^(https?:\/\/|\/)/i.test(url);
}

function getLeaderPhoto(leaderPhoto: string | undefined | null, leaderIndex: number): string {
  if (!isValidImageUrl(leaderPhoto)) {
    // Fallback to a default placeholder image from Unsplash
    return `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=120&h=120&seed=${leaderIndex}`;
  }
  // If it's already a full URL with query params, use it as is
  if (leaderPhoto?.includes('?')) {
    return leaderPhoto;
  }
  // Otherwise add the image optimization params
  return `${leaderPhoto}?auto=format&fit=facearea&facepad=2&w=120&h=120&seed=${leaderIndex}`;
}

export function TeamLeadersShowcase({ teams }: TeamLeadersShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const gap = 24;
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get responsive card width
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 400;
    if (window.innerWidth < 768) return window.innerWidth - 120; // Mobile
    if (window.innerWidth < 1024) return 350; // Tablet
    return 400; // Desktop
  };

  // Duplicate teams for infinite scroll
  const duplicatedTeams = [...teams, ...teams, ...teams];

  const handlePrev = () => {
    if (isDragging) return;
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? teams.length - 1 : prev - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    if (isDragging) return;
    setCurrentIndex((prev) => {
      const newIndex = prev === teams.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  // Animate to current index
  useEffect(() => {
    if (!isDragging) {
      const cardWidthValue = getCardWidth();
      const offset = -(currentIndex * (cardWidthValue + gap));
      animate(x, offset, { type: "spring", stiffness: 300, damping: 30 });
    }
  }, [currentIndex, isDragging, x]);

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();
    const cardWidthValue = getCardWidth();
    const newIndex = Math.round(-currentX / (cardWidthValue + gap));
    const clampedIndex = ((newIndex % teams.length) + teams.length) % teams.length;
    setCurrentIndex(clampedIndex);
  };

  // Professional infinite auto-scroll
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    // Only auto-scroll if not dragging and not paused
    if (!isDragging && !isPaused && teams.length > 0) {
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          // Seamlessly loop: when at the end, go to start
          return (prev + 1) % teams.length;
        });
      }, 4000); // Auto-scroll every 4 seconds
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isDragging, isPaused, teams.length]);

  return (
    <section className="space-y-8 sm:space-y-10 md:space-y-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 sm:space-y-4 px-4"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#8B4513]">
            Team Leaders
          </h2>
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
          </motion.div>
        </div>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Meet the inspiring leaders guiding each team towards excellence in Islamic art and culture
        </p>
      </motion.div>

      {/* Slider Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-2 border-gray-200 hover:border-[#8B4513] group"
          aria-label="Previous team"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setTimeout(() => setIsPaused(false), 1000)}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-[#8B4513] transition-colors" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-2 border-gray-200 hover:border-[#8B4513] group"
          aria-label="Next team"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setTimeout(() => setIsPaused(false), 1000)}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-[#8B4513] transition-colors" />
        </button>

        {/* Slider */}
        <div className="overflow-hidden px-8 sm:px-12 md:px-16 py-3">
          <motion.div
            ref={sliderRef}
            drag="x"
            dragConstraints={{ left: -Infinity, right: Infinity }}
            dragElastic={0.2}
            onDragStart={() => {
              setIsDragging(true);
              setIsPaused(true);
            }}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="flex gap-3 sm:gap-4 md:gap-6 cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {duplicatedTeams.map((team, teamIndex) => {
              const leaders = parseLeaders(team.leader);
              const colors = TEAM_COLORS[team.name] || {
                primary: "#6B7280",
                gradient: "from-gray-500 to-gray-600",
                light: "#F9FAFB",
              };

              return (
                <motion.div
                  key={`${team.id}-${teamIndex}`}
                  className="group shrink-0 w-[calc(100vw-80px)] sm:w-[calc(100vw-120px)] md:w-[350px] lg:w-[400px]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
              <div
                className={`bg-gradient-to-br ${colors.gradient} rounded-2xl sm:rounded-3xl p-[3px] hover:shadow-2xl transition-all duration-300 h-full`}
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 h-full flex flex-col relative overflow-hidden">
                  {/* Decorative Background Elements */}
                  <div 
                    className="absolute top-0 right-0 w-40 h-40 opacity-5 rounded-full blur-3xl"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-32 h-32 opacity-5 rounded-full blur-2xl"
                    style={{ backgroundColor: colors.primary }}
                  />

                  <div className="relative z-10">
                    {/* Team Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-100">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 shrink-0"
                          style={{ 
                            backgroundColor: colors.light,
                            border: `3px solid ${colors.primary}30`
                          }}
                        >
                          <span style={{ color: colors.primary }}>
                            {team.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{team.name}</h3>
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                            <span className="text-xs text-gray-600 font-medium">
                              {leaders.length === 1 ? "1 Leader" : `${leaders.length} Leaders`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="shrink-0"
                      >
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
                      </motion.div>
                    </div>

                    {/* Leaders List */}
                    <div className="space-y-2 sm:space-y-3 flex-1">
                      {leaders.map((leader, leaderIndex) => (
                        <motion.div
                          key={leaderIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: leaderIndex * 0.1 }}
                          className="group/item relative"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-md">
                            {/* Leader Avatar */}
                            <div className="relative shrink-0">
                              <div
                                className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-3 ring-2 ring-transparent group-hover/item:ring-yellow-400/50 transition-all shadow-lg"
                                style={{ 
                                  borderColor: colors.primary,
                                  borderRadius: '1rem'
                                }}
                              >
                                <Image
                                  src={getLeaderPhoto(team.leader_photo, leaderIndex)}
                                  alt={leader}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
                              </div>
                              {/* Crown Badge */}
                              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 sm:p-1 shadow-lg">
                                <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                              </div>
                            </div>

                            {/* Leader Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-base sm:text-lg truncate mb-1">
                                {leader}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-200">
                                  {leaders.length > 1 ? "Co-Leader" : "Team Leader"}
                                </span>
                              </div>
                            </div>

                            {/* Arrow Icon */}
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="text-gray-400 group-hover/item:text-[#8B4513] transition-colors shrink-0"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {teams.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 3000);
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'w-6 sm:w-8 bg-[#8B4513]'
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to team ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

