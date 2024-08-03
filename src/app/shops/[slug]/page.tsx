import { Fragment } from "react";
import Hidden from "@component/hidden";
import Grid from "@component/grid/Grid";
import api from "@utils/__api__/shops";
import ProductFilterCard from "@component/products/ProductFilterCard";
import ShopIntroCard from "@sections/shop/ShopIntroCard";
import ProductDetails from "@component/shop/ProductDetails";

const ShopDetails = async ({ params }: { params: { slug: string } }) => {
  const shop = await api.getShopBySlug(String(params.slug));

  return (
    <Fragment>
      <ShopIntroCard />

      <Grid container spacing={6}>
        {/* SHOW IN LARGE DEVICE */}
        <Hidden as={Grid} item md={3} xs={12} down={1024}>
          <ProductFilterCard />
        </Hidden>

        <ProductDetails shop={shop} />
      </Grid>
    </Fragment>
  );
};

// ShopDetails.layout = NavbarLayout;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = await api.getSlugs();

//   return {
//     paths: paths, //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const shop = await api.getShopBySlug(String(params.slug));
//   return { props: { shop } };
// };

export default ShopDetails;
