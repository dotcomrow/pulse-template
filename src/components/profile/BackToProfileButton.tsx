"use client";
import { useRouter } from "next/navigation";
import { Button } from "@component/buttons";

const BackToProfileButton = () => {
  const { push } = useRouter();
  return (
    <Button
      color="primary"
      bg="primary.light"
      px="2rem"
      onClick={() => push("/profile")}
    >
      Back to Profile
    </Button>
  );
};

export default BackToProfileButton;
