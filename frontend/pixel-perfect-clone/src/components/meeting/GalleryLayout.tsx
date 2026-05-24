"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { ParticipantTile } from "./ParticipantTile";

export function GalleryLayout() {
  const { participants, currentPage, setCurrentPage } = useMeeting();
  
  const admitted = participants.filter(p => p.status === "admitted");
  const count = admitted.length;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial size
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Use clientWidth/clientHeight as they represent the layout space accurately
        if (containerRef.current) {
          setDimensions({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

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

  // Let's compute the optimal cols and rows to fit visibleCount tiles in dimensions
  let bestCols = 1;
  let bestRows = 1;
  let bestTileWidth = 0;
  let bestTileHeight = 0;

  if (dimensions.width > 0 && dimensions.height > 0 && visibleCount > 0) {
    let bestArea = 0;
    const aspectRatio = 16 / 9; // Target aspect ratio for each participant tile
    const gap = 8;

    for (let cols = 1; cols <= visibleCount; cols++) {
      const rows = Math.ceil(visibleCount / cols);
      
      const availableWidth = dimensions.width - (cols - 1) * gap;
      const availableHeight = dimensions.height - (rows - 1) * gap;
      
      const cellWidth = availableWidth / cols;
      const cellHeight = availableHeight / rows;
      
      if (cellWidth <= 0 || cellHeight <= 0) continue;
      
      let tileWidth = cellWidth;
      let tileHeight = cellHeight;
      
      // Constrain tile to aspect ratio 16:9
      if (cellWidth / cellHeight > aspectRatio) {
        tileWidth = cellHeight * aspectRatio;
      } else {
        tileHeight = cellWidth / aspectRatio;
      }
      
      const area = tileWidth * tileHeight;
      if (area > bestArea) {
        bestArea = area;
        bestCols = cols;
        bestRows = rows;
        bestTileWidth = tileWidth;
        bestTileHeight = tileHeight;
      }
    }
  } else {
    // Fallback if dimensions aren't loaded yet
    bestCols = Math.ceil(Math.sqrt(visibleCount));
    bestRows = Math.ceil(visibleCount / bestCols);
  }

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* Video Grid Container */}
      <div 
        ref={containerRef}
        className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden"
      >
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${bestCols}, 1fr)`,
            gridTemplateRows: `repeat(${bestRows}, 1fr)`,
            gap: "8px",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            justifyItems: "center"
          }}
        >
          {visibleParticipants.map(p => (
            <div 
              key={`gallery-p-${p.id}`} 
              className="flex items-center justify-center select-none"
              style={{
                width: bestTileWidth > 0 ? `${bestTileWidth}px` : "100%",
                height: bestTileHeight > 0 ? `${bestTileHeight}px` : "100%",
                maxWidth: "100%",
                maxHeight: "100%"
              }}
            >
              <ParticipantTile p={p} />
            </div>
          ))}
        </div>
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
