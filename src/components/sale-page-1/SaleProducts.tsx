"use client";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Product from "@models/product.model";
import { ProductCard1 } from "@component/product-cards";
import { useRouter } from "next/navigation";
import Pagination from "@component/pagination";
import { SemiSpan } from "@component/Typography";
import { renderProductCount } from "@utils/utils";
import { Meta } from "interfaces";

type Props = {
  products: Product[];
  meta: Meta;
};
const SaleProducts = ({ products, meta }: Props) => {
  const { push } = useRouter();
  const handlePageChange = (page: number) => push(`?page=${page + 1}`);

  return (
    <>
      <Grid container spacing={6}>
        {products.map((item: Product, ind: number) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              price={item.price}
              title={item.title}
              off={item.discount}
              images={item.images as string[]}
              imgUrl={item.thumbnail}
              rating={item.rating || 4}
            />
          </Grid>
        ))}
      </Grid>
      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        my="4rem"
      >
        <SemiSpan>
          {renderProductCount(meta.page - 1, meta.pageSize, meta.total)}
        </SemiSpan>
        <Pagination onChange={handlePageChange} pageCount={meta.totalPage} />
      </FlexBox>
    </>
  );
};

export default SaleProducts;
