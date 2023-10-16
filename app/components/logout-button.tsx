import { useSubmit } from "@remix-run/react";
import { Button } from "./ui/button";

export const LogoutButton = () => {
  const submit = useSubmit();

  return (
    <Button
      variant="destructive"
      onClick={() =>
        submit(null, {
          method: "post",
          action: "/logout",
        })
      }
    >
      Logout
    </Button>
  );
};
