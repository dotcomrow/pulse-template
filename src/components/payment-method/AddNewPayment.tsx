"use client";
import { useRouter } from "next/navigation";
import { Button } from "@component/buttons";

const AddNewPayment = () => {
  const { push } = useRouter();
  return (
    <Button
      color="primary"
      bg="primary.light"
      px="2rem"
      onClick={() => push("/payment-methods/add")}
    >
      Add New Payment Method
    </Button>
  );
};

export default AddNewPayment;
