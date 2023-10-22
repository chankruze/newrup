import type { FC } from "react";
import type { SocialLinkType } from "~/consts";

type SocialLinkProps = {} & SocialLinkType;

export const SocialLink: FC<SocialLinkProps> = ({ name, url, icon: Icon }) => {
  return (
    <a
      key={name}
      href={url}
      className="duration-250 rounded-full bg-blue-300/30 p-3 text-blue-400 transition-colors
      hover:bg-blue-300/50 dark:bg-yellow-800/30 dark:text-yellow-400 dark:hover:bg-yellow-800/50"
      target="_blank"
      rel="noreferrer"
    >
      {Icon ? <Icon className="h-8 w-8" /> : name}
    </a>
  );
};
