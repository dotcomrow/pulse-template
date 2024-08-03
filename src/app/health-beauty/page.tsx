import { Fragment } from "react";
import Box from "@component/Box";
import { Footer2 } from "@component/footer";
import api from "@utils/__api__/health-beauty";
import Section1 from "@sections/health-beauty/Section1";
import Section2 from "@sections/health-beauty/Section2";
import Section3 from "@sections/health-beauty/Section3";
import Section4 from "@sections/health-beauty/Section4";
import Section5 from "@sections/health-beauty/Section5";
import SideNavbar2 from "@component/sidenav/SideNavbar2";
import SidenavContainer from "@component/SidenavContainer";

const HealthBeautyShop = async () => {
  const FIXED_ID = "banner-area";
  const serviceList = await api.getServices();
  const allProducts = await api.getProducts();
  const navigationList = await api.getNavigation();
  const topNewProducts = await api.getTopNewProducts();
  const mainCarouselData = await api.getMainCarousel();

  return (
    <Fragment>
      {/* HERO CAROUSEL AREA */}
      <Section1 id={FIXED_ID} carouselData={mainCarouselData} />

      {/* SIDEBAR WITH MAIN CONTENT AREA */}
      <SidenavContainer
        navFixedComponentID={FIXED_ID}
        SideNav={<SideNavbar2 navList={navigationList} />}
      >
        {/* BANNER AREA */}
        <Box mb="4rem">
          <Section2 />
        </Box>

        {/* TOP NEW PRODUCTS AREA */}
        <Section3 title="Top New Products" products={topNewProducts} />

        {/* ALL PRODUCTS AREA */}
        <Section4 products={allProducts} />

        {/* SERVICES AREA */}
        <Section5 services={serviceList as any} />

        {/* FOOTER AREA */}
        <Footer2 />
      </SidenavContainer>
    </Fragment>
  );
};

export default HealthBeautyShop;
