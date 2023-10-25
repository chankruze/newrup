import type { FC } from "react";

type StatsCardProps = {
  count: string | number;
  title: string;
};

export const StatsCard: FC<StatsCardProps> = ({ count, title }) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-3xl bg-gradient-to-tr  p-6 shadow-lg from-blue-100 dark:from-zinc-800 sm:p-8">
      <h1 className="font-outfit text-4xl font-bold capitalize text-blue-500 dark:text-yellow-400">
        {count}+
      </h1>
      <p className="text-lg font-medium sm:text-xl">{title}</p>
    </div>
  );
};
