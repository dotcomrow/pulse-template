import { Fragment } from "react";
import api from "@utils/__api__/furniture";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";
import Section1 from "@sections/furniture-shop/Section1";
import Section3 from "@sections/furniture-shop/Section3";
import Section4 from "@sections/furniture-shop/Section4";
import ContentBox from "@sections/furniture-shop/ContentBox";

const FurnitureShop = async () => {
  const topNewProducts = await api.getTopNewProducts();
  const mainCarouselData = await api.getMainCarouselData();
  const furnitureProducts = await api.getFurnitureProducts();
  const sidebarNavList = await api.getFurnitureShopNavList();
  const topSellingProducts = await api.getTopSellingProducts();

  return (
    <Fragment>
      {/* NAVBAR AREA */}
      <Navbar />

      {/* HERO CAROUSEL AREA */}
      <Section1 mainCarouselData={mainCarouselData} />

      <Container>
        <ContentBox sidebarNavList={sidebarNavList} />

        {/* TOP NEW PRODUCTS AREA */}
        <Section3 products={topNewProducts} title="Top New Product" />

        {/* TOP SELLING PRODUCTS AREA */}
        <Section3 products={topSellingProducts} title="Top Selling Product" />

        {/* ALL PRODUCTS AREA  */}
        <Section4 products={furnitureProducts} />
      </Container>
    </Fragment>
  );
};

export default FurnitureShop;
