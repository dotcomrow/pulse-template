import axios from "axios";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H1 } from "@component/Typography";
import Container from "@component/Container";
import SaleNavbar from "@component/sale-page-1/SaleNavbar";
import SaleCategory from "@component/sale-page-1/SaleCategory";
import SaleProducts from "@component/sale-page-1/SaleProducts";
import { SearchParams } from "interfaces";

const SalePage1 = async ({ searchParams }: SearchParams) => {
  const PAGE_SIZE = 28;
  const PAGE = searchParams?.page ? Number(searchParams.page) : 1;
  const { data } = await axios.get("/api/products", {
    params: { page: PAGE, pageSize: PAGE_SIZE },
  });

  const saleCategoryList = [
    { icon: "women-dress", title: "Women" },
    { icon: "beauty-products", title: "Cosmetics" },
    { icon: "camera", title: "Eelctronics" },
    { icon: "sofa", title: "Furniture" },
  ];

  return (
    <Container mt="2rem">
      <SaleNavbar saleCategoryList={saleCategoryList} />

      <Box>
        <FlexBox mb="2rem" flexWrap="wrap">
          <H1 color="primary.main" mr="0.5rem" lineHeight="1">
            Flash Deals,
          </H1>

          <H1 color="text.muted" lineHeight="1">
            Enjoy Upto 80% discounts
          </H1>
        </FlexBox>

        <SaleCategory saleCategoryList={saleCategoryList} />
      </Box>

      <SaleProducts products={data.result} meta={data.meta} />
    </Container>
  );
};

export default SalePage1;
