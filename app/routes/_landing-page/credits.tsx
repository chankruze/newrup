import { SITE_TITLE } from "~/consts";

export const Credits = () => {
  return (
    <div className="grid place-content-center gap-2 border-t bg-credits py-6  text-credits-foreground">
      <div>&copy; {SITE_TITLE}. All Rights Reserved.</div>
      <div className="text-center font-poppins text-sm font-medium">
        <span>Developed with ❤️ by</span>{" "}
        <a
          href="https://github.com/chankruze"
          className="underline hover:text-black"
        >
          chankruze
        </a>
      </div>
    </div>
  );
};
