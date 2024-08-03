import { Fragment } from "react";
import api from "@utils/__api__/grocery-3";
import Container from "@component/Container";
import Section1 from "@sections/grocery-3/Section1";
import Section2 from "@sections/grocery-3/Section2";
import Section3 from "@sections/grocery-3/Section3";
import Section4 from "@sections/grocery-3/Section4";

const GroceryThree = async () => {
  const offerCards = await api.getOfferCards();
  const allProducts = await api.getAllProducts();
  const mainCarouselData = await api.getMainCarousel();
  const topSailedProducts = await api.getTopSailedProducts();

  return (
    <Fragment>
      {/* HERO CAROUSEL AREA */}
      <Section1 carouselData={mainCarouselData} />

      <Container>
        {/* OFFER PRODUCTS AREA */}
        <Section2 offerProducts={offerCards} />

        {/* TOP SAILED PRODUCTS AREA */}
        <Section3 products={topSailedProducts} />

        {/* ALL PRODUCTST AREA */}
        <Section4 products={allProducts} />
      </Container>
    </Fragment>
  );
};

export default GroceryThree;
