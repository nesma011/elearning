import React, { useEffect, useState } from "react";

const Rank = () => {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();

    const formattedTime = `${hours}:${minutes} ${day}-${month}-${year}`;
    setLastUpdated(formattedTime);
  }, []); 

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="bg-[#131B26] text-white rounded-lg w-full md:w-1/2 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Rank</h2>
          <span className="text-xl" role="img" aria-label="trophy">
            🏆
          </span>
        </div>
        <div className="text-center mb-8">
          <p>You Must Solve At least 100 Questions to Enter The Alex-MedLearn Rank</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t border-red-500 text-xs p-2">
          Last updated: {lastUpdated}
        </div>
      </div>

      <div className="bg-[#131B26] text-white rounded-lg w-full md:w-1/2 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Speed Index</h2>
          <span className="text-xl" role="img" aria-label="clock">
            ⏱
          </span>
        </div>
        <div className="text-center mb-8">
          <p>18 Seconds Per Question</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t border-red-500 text-xs p-2">
          Last updated: {lastUpdated}
        </div>
      </div>
    </div>
  );
};

export default Rank;
