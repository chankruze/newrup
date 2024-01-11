// src/components/MilestoneTimeline.js

import { Link } from "@remix-run/react";
import { format } from "date-fns";
import type { FC } from "react";

type MilestoneTimelineProps = {
  milestonesData: {
    [key: string]: string;
  }[];
};

const MilestoneTimeline: FC<MilestoneTimelineProps> = ({ milestonesData }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-screen-lg flex-col">
        <div className="w-full">
          {milestonesData.map((milestone, index) => (
            <div key={index} className="relative p-4">
              <div className="absolute left-0 top-0 h-full w-1 -translate-x-1/2 transform bg-blue-300" />
              <div className="absolute left-0 top-1/4 h-4 w-4 -translate-x-1/2 transform rounded-full border-4 border-blue-500 bg-white" />
              <Link to={milestone.link} target="_blank" rel="noreferrer">
                <div className="space-y-2 rounded-lg bg-white p-4 shadow-md">
                  <h3 className="line-clamp-2 font-outfit text-lg font-semibold text-blue-500 md:text-xl">
                    {milestone.title}
                  </h3>
                  <p className="line-clamp-3 font-roboto text-sm text-gray-600 md:text-base">
                    {milestone.description}
                  </p>
                  <p className="text-xs italic text-gray-400 md:text-sm">
                    {format(new Date(milestone.date), "PPP")}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneTimeline;
