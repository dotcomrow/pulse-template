"use client";
import { useRouter } from "next/navigation";
import { Button } from "@component/buttons";

const BackToSupport = () => {
  const { push } = useRouter();
  return (
    <Button
      px="2rem"
      color="primary"
      bg="primary.light"
      onClick={() => push("/support-tickets")}
    >
      Back to Support Ticket
    </Button>
  );
};

export default BackToSupport;
