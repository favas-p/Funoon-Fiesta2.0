"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, Medal } from "lucide-react";
import type { Team } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface LiveScorePulseProps {
  teams: Team[];
  liveScores: Map<string, number>;
}

// Team color mappings
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

function getMedalColor(index: number): string {
  switch (index) {
    case 0:
      return "#FFD700";
    case 1:
      return "#C0C0C0";
    case 2:
      return "#CD7F32";
    default:
      return "transparent";
  }
}

interface TeamCardProps {
  team: Team & { totalPoints: number; colors: { primary: string; gradient: string; light: string } };
  index: number;
  maxPoints: number;
}

function TeamCard({ team, index, maxPoints }: TeamCardProps) {
  const percentage = maxPoints > 0 ? (team.totalPoints / maxPoints) * 100 : 0;
  const isTopThree = index < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group"
    >
      <div
        className={`bg-gradient-to-br ${team.colors.gradient} rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl transform-gpu p-[3px] ${
          isTopThree ? 'ring-2 ring-offset-2 ring-offset-[#fffcf5]' : ''
        }`}
        style={isTopThree ? { 
          boxShadow: `0 0 0 2px ${getMedalColor(index)}40, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
        } as React.CSSProperties : {}}
      >
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div 
            className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-5 rounded-full blur-3xl"
            style={{ backgroundColor: team.colors.primary }}
          />
          
          <div className="relative z-10">
            <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-lg sm:text-xl md:text-2xl shadow-md sm:shadow-lg transition-transform group-hover:scale-110 shrink-0"
                  style={{ 
                    backgroundColor: team.colors.light,
                    border: `2px solid ${team.colors.primary}20`,
                    borderRadius: '0.75rem'
                  }}
                >
                  <span style={{ color: team.colors.primary }}>{team.name.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg truncate">{team.name}</h3>
                    {isTopThree && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="shrink-0"
                      >
                        <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: getMedalColor(index) }} />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      Rank #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 block leading-none">
                  {formatNumber(team.totalPoints)}
                </span>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">points</p>
              </div>
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 md:h-3.5 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  className="h-full rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                  style={{ 
                    backgroundColor: team.colors.primary,
                    borderRadius: '9999px'
                  }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                  />
                </motion.div>
              </div>
              <div className="flex justify-between items-center text-[10px] sm:text-xs">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="font-bold text-gray-900">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface DistributionChartProps {
  teams: Array<Team & { totalPoints: number; colors: { primary: string } }>;
}

function DistributionChart({ teams }: DistributionChartProps) {
  const maxPoints = Math.max(...teams.map((team) => team.totalPoints), 1);

  return (
    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-xl h-[280px] sm:h-[320px] md:h-[380px] lg:h-auto flex flex-col">
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">Points Distribution</h4>
        <p className="text-xs text-gray-500">Visual comparison of team scores</p>
      </div>
      <div className="relative flex-1 min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex items-end justify-between gap-1.5 sm:gap-2 md:gap-3">
        {teams.map((team, index) => {
          const height = maxPoints > 0 ? (team.totalPoints / maxPoints) * 100 : 0;
          return (
            <motion.div
              key={team.id}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.4, ease: "easeOut" }}
              className="relative flex-1 group flex flex-col items-center min-w-0"
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-xl sm:rounded-t-2xl transition-all duration-300 hover:opacity-100 hover:scale-105 shadow-md sm:shadow-lg"
                style={{
                  backgroundColor: team.colors.primary,
                  opacity: 0.85,
                  height: "100%",
                  borderTopLeftRadius: '0.75rem',
                  borderTopRightRadius: '0.75rem',
                }}
              >
                {/* Tooltip - hidden on mobile, shown on hover for desktop */}
                <div className="hidden md:block absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl z-10 border border-gray-700">
                  <div className="font-bold text-xs sm:text-sm">{team.name}</div>
                  <div className="text-white/80 text-xs mt-0.5">{formatNumber(team.totalPoints)} pts</div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
                {/* Value label on bar - always visible */}
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-lg bg-black/30 px-1.5 sm:px-2 py-0.5 rounded">
                    {formatNumber(team.totalPoints)}
                  </span>
                </div>
              </div>
              {/* Team name label */}
              <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 transform -translate-x-1/2 text-center w-full px-0.5">
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 truncate block">
                  {team.name.slice(0, 4)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function LiveScorePulse({ teams, liveScores }: LiveScorePulseProps) {
  const teamsWithScores = teams.map((team) => {
    const totalPoints = liveScores.get(team.id) ?? team.total_points;
    const colors = TEAM_COLORS[team.name] || {
      primary: "#6B7280",
      gradient: "from-gray-500 to-gray-600",
      light: "#F9FAFB",
    };
    return { ...team, totalPoints, colors };
  });

  const sortedTeams = [...teamsWithScores].sort((a, b) => b.totalPoints - a.totalPoints);
  const maxPoints = Math.max(...sortedTeams.map((t) => t.totalPoints), 1);

  return (
    <section className="space-y-6 sm:space-y-8 md:space-y-10">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 sm:space-y-3 md:space-y-4 px-2"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-1 sm:mb-2">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-cyan-400 rounded-lg sm:rounded-xl md:rounded-2xl opacity-20 blur-xl"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-[#8B4513] mb-0.5 sm:mb-1">
              Live Score Pulse
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">Real-time team rankings & performance</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Team Cards */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {sortedTeams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} maxPoints={maxPoints} />
            ))}
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="order-1 lg:order-2">
          <DistributionChart teams={sortedTeams} />
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-4 sm:pt-6 px-4"
      >
        <Link
          href="/scoreboard"
          className="group relative bg-gradient-to-r from-[#8B4513] to-[#6B3410] hover:from-[#6B3410] hover:to-[#8B4513] transition-all py-3 sm:py-4 px-6 sm:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold text-white shadow-xl hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto text-center"
        >
          <span className="relative z-10">View Full Scoreboard</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </Link>
        <Link
          href="/results"
          className="group relative bg-gradient-to-r from-[#0d7377] to-[#0a5a5d] hover:from-[#0a5a5d] hover:to-[#0d7377] transition-all py-3 sm:py-4 px-6 sm:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold text-white shadow-xl hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto text-center"
        >
          <span className="relative z-10">View Results</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </Link>
      </motion.div>
    </section>
  );
}

