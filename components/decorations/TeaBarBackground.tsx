import React from "react";

export function TeaBarBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0] to-[#F0E8DC]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #D4A574 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.08,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8C5E45] via-[#D4A574] to-[#8C5E45]" />
    </div>
  );
}

export default TeaBarBackground;
