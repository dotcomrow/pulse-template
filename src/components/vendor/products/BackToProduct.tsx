import { Button } from "@component/buttons";
import Link from "next/link";

const BackToProduct = () => {
  return (
    <Link href="/vendor/products">
      <Button color="primary" bg="primary.light" px="2rem">
        Back to Product List
      </Button>
    </Link>
  );
};

export default BackToProduct;
