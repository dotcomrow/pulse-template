import { Fragment } from "react";
import Box from "@component/Box";
import api from "@utils/__api__/fashion-3";
import Navbar from "@component/navbar/Navbar";
import Section1 from "@sections/fashion-3/Section1";
import Section2 from "@sections/fashion-3/Section2";
import Section3 from "@sections/fashion-3/Section3";
import Section4 from "@sections/fashion-3/Section4";
import Section5 from "@sections/fashion-3/Section5";
import Section6 from "@sections/fashion-3/Section6";
import Section7 from "@sections/fashion-3/Section7";
import Section8 from "@sections/fashion-3/Section8";

const FashionThree = async () => {
  const blogs = await api.getBlogs();
  const products = await api.getProducts();
  const services = await api.getServices();
  const featureProducts = await api.getFeatureProducts();
  const mainCarouselData = await api.getMainCarouselData();

  return (
    <Fragment>
      {/* NAVBAR AREA */}
      <Navbar />

      <Box bg="white" pb="4rem">
        {/* HERO CAROUSEL AREA */}
        <Section1 carouselData={mainCarouselData} />

        {/* MEN AND WOMEN OFFERS AREA */}
        <Section2 />

        {/* BEST SELLING PRODUCTS AREA */}
        <Section3 products={products} />

        {/* TOP CATEGORIES AREA */}
        <Section4 />

        {/* SALE OFFER BANNERS AREA */}
        <Section5 />

        {/* FEATURED PRODUCTS AREA */}
        <Section6 products={featureProducts} />

        {/* SERVICE LIST AREA */}
        <Section7 services={services} />

        {/* BLOG LIST AREA */}
        <Section8 blogs={blogs} />
      </Box>
    </Fragment>
  );
};

export default FashionThree;
