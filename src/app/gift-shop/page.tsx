import { Fragment } from "react";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";
import Section1 from "@sections/gift-shop/Section1";
import Section5 from "@sections/gift-shop/Section5";
import Section6 from "@sections/gift-shop/Section6";
import api from "@utils/__api__/gift";
import ContentBox from "@sections/gift-shop/ContentBox";
import Category from "@models/category.model";

const GiftShop = async () => {
  const allProducts = await api.getAllProducts();
  const serviceList = await api.getServiceList();
  const topCategories = await api.getTopCategories();
  const carouselData = await api.getMainCarouselData();
  const popularProducts = await api.getPopularProducts();
  const topSailedProducts = await api.getTopSailedProducts();
  const categoryNavigation = await api.getCategoryNavigation();

  return (
    <Fragment>
      {/* NAVBAR AREA */}
      <Navbar />

      {/* HERO CAROUSEL AREA */}
      <Section1 carouselData={carouselData} />

      <Container>
        <ContentBox
          serviceList={serviceList}
          topCategories={topCategories as Category[]}
          categoryNavigation={categoryNavigation}
        />

        {/* POPULAR PRODUCTS AREA */}
        <Section5 products={popularProducts} title="Popular Items" />

        {/* TOP SALED PRODUCTS AREA */}
        <Section5 products={topSailedProducts} title="Top Saled Items" />

        {/* ALL PRODUCTS AREA */}
        <Section6 products={allProducts} />
      </Container>
    </Fragment>
  );
};

export default GiftShop;
