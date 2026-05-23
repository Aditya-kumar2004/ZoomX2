"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { ParticipantTile } from "./ParticipantTile";

export function GalleryLayout() {
  const { participants, currentPage, setCurrentPage } = useMeeting();
  
  const admitted = participants.filter(p => p.status === "admitted");
  const count = admitted.length;

  if (count === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400">
        No other participants admitted yet.
      </div>
    );
  }

  const maxPerPage = 9;
  const totalPages = Math.ceil(count / maxPerPage);
  const startIndex = currentPage * maxPerPage;
  const visibleParticipants = admitted.slice(startIndex, startIndex + maxPerPage);
  
  const visibleCount = visibleParticipants.length;
  const cols = Math.ceil(Math.sqrt(visibleCount));

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "8px",
    width: "100%",
    height: totalPages > 1 ? "calc(100% - 44px)" : "100%",
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* Video Grid */}
      <div style={gridStyle}>
        {visibleParticipants.map(p => (
          <div key={`gallery-p-${p.id}`} className="w-full h-full min-h-0 select-none">
            <ParticipantTile p={p} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="h-9 shrink-0 flex items-center justify-center gap-4 bg-[#1C1C1C]/40 border border-gray-800/50 backdrop-blur-md rounded-xl px-4 py-1.5 self-center shadow-lg mt-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#2D2D2D] hover:bg-[#3D3D3D] disabled:opacity-40 disabled:hover:bg-[#2D2D2D] transition-colors text-white"
          >
            &larr; Prev
          </button>
          <span className="text-xs text-gray-400 font-medium select-none">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#2D2D2D] hover:bg-[#3D3D3D] disabled:opacity-40 disabled:hover:bg-[#2D2D2D] transition-colors text-white"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
