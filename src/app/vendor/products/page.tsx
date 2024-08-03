import axios from "axios";
import { Fragment } from "react";
import Hidden from "@component/hidden";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import ProductsList from "@component/vendor/products/ProductsList";

const Products = async ({ params }: { params: { page: string } }) => {
  const { data } = await axios.get("/api/products", {
    params: { pageSize: 10, page: params.page ? parseInt(params.page) : 1 },
  });

  return (
    <Fragment>
      <DashboardPageHeader title="Products" iconName="delivery-box" />

      <Hidden down={769}>
        <TableRow
          padding="0px 18px"
          mb="-0.125rem"
          boxShadow="none"
          backgroundColor="transparent"
        >
          <FlexBox my="0px" mx="6px" flex="2 2 220px !important">
            <H5 ml="56px" color="text.muted" textAlign="left">
              Name
            </H5>
          </FlexBox>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Regular price
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Sale Price
          </H5>

          <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px" />
        </TableRow>
      </Hidden>

      <ProductsList products={data.result} meta={data.meta} />
    </Fragment>
  );
};

export default Products;
