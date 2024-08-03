import { Fragment } from "react";
import Box from "@component/Box";
import api from "@utils/__api__/gadget";
import Navbar from "@component/navbar/Navbar";
import Section1 from "@sections/gadget-shop/Section1";
import Section2 from "@sections/gadget-shop/Section2";
import Section3 from "@sections/gadget-shop/Section3";
import Section4 from "@sections/gadget-shop/Section4";
import Section5 from "@sections/gadget-shop/Section5";
import Section6 from "@sections/gadget-shop/Section6";
import Section7 from "@sections/gadget-shop/Section7";

const GadgetShop = async () => {
  const twoBanner = await api.getTwoBanner();
  const blogLists = await api.getBlogLists();
  const topPickList = await api.getTopPicksList();
  const newArrivalsData = await api.getNewArrival();
  const mostViewedList = await api.getMostViewedList();
  const mainCarouselData = await api.getMainCarousel();
  const featuredCategories = await api.getFeaturedCategories();

  return (
    <Fragment>
      {/* NAVIGATION BAR AREA */}
      <Navbar />

      <Box my="2rem">
        {/* TOP PICKS AND NEW WINTER PRODUCTS CAROUSEL AREA */}
        <Section1 mainCarousel={mainCarouselData} topPickList={topPickList} />

        {/* FEATURED CATEGORIES AREA */}
        <Section2 categories={featuredCategories} />

        {/* DISCOUNT BANNERS AREA */}
        <Section3 bannerData={twoBanner} />

        {/* MOST VIEWWD PRODUCTS CAROUSEL AREA */}
        <Section4 products={mostViewedList} />

        {/* NEW ARRIVAL PRODUCTS CAROUSEL AREA */}
        <Section5 products={newArrivalsData} />

        {/* OFFER BANNER AREA */}
        <Section6 />

        {/* BLOGS AREA */}
        <Section7 blogs={blogLists} />
      </Box>
    </Fragment>
  );
};

export default GadgetShop;
