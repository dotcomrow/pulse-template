import axios from "axios";
import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@component/buttons";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import ProductUpdateForm from "@component/vendor/products/ProductUpdateForm";

const categoryOptions = [
  { label: "Fashion", value: "fashion" },
  { label: "Gadget", value: "gadget" },
];

const ProductDetails = async ({ params }: { params: { slug: string } }) => {
  const { data } = await axios.get("/api/products/slug", {
    params: { slug: params.slug as string },
  });

  return (
    <Fragment>
      <DashboardPageHeader
        title="Edit Product"
        iconName="delivery-box"
        button={
          <Link href="/vendor/products">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Product List
            </Button>
          </Link>
        }
      />

      <ProductUpdateForm product={data} categoryOptions={categoryOptions} />
    </Fragment>
  );
};

export default ProductDetails;
