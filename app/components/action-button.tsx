import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type ActionButtonProps = {
  icon: LucideIcon;
  tooltip: string;
  action?: () => void;
};

export const ActionButton = ({
  tooltip,
  action,
  icon: Icon,
}: ActionButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-2 hover:bg-accent" onClick={action}>
            <Icon className="h-5 w-5" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
