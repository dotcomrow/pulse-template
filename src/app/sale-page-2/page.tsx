import axios from "axios";
import Container from "@component/Container";
import SaleProducts2 from "@component/sale-page-2/SaleProducts2";
import { SearchParams } from "interfaces";

const SalePage2 = async ({ searchParams }: SearchParams) => {
  const PAGE_SIZE = 28;
  const PAGE = searchParams?.page ? Number(searchParams.page) : 1;
  const params = { page: PAGE, pageSize: PAGE_SIZE };
  const { data } = await axios.get("/api/products", { params });

  return (
    <Container mt="2rem">
      <SaleProducts2 products={data.result} meta={data.meta} />
    </Container>
  );
};

export default SalePage2;
