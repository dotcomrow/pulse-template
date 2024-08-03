"use client";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Sidenav from "@component/sidenav/Sidenav";
import ProductCardList from "@component/products/ProductCard1List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
import Shop from "@models/shop.model";
import Product from "@models/product.model";

type Props = { shop: Shop };
const ProductDetails = ({ shop }: Props) => {
  const width: any = useWindowSize();
  const isTablet = width < 1025;

  return (
    <Grid item md={9} xs={12}>
      {/* SHOW IN SMALL DEVICE */}
      {isTablet && (
        <Sidenav
          scroll={true}
          position="left"
          handle={
            <FlexBox justifyContent="flex-end" mb="12px">
              <Icon>options</Icon>
            </FlexBox>
          }
        >
          <ProductFilterCard />
        </Sidenav>
      )}

      <ProductCardList products={shop.products?.slice(0, 9) as Product[]} />
    </Grid>
  );
};

export default ProductDetails;
