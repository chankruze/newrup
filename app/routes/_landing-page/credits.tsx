import { ExternalLink } from "lucide-react";

export const Credits = () => {
  return (
    <div className="bg-credits text-credits-foreground flex items-center justify-center gap-1 border-t py-6 font-outfit font-medium">
      <span>Developed by</span>
      <a href="https://github.com/chankruze" className="italic underline">
        chankruze
      </a>
      <ExternalLink className="h-4 w-4" />
    </div>
  );
};
