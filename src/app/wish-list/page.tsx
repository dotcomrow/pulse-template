"use client";
import db from "@data/db";
import { Fragment } from "react";
import Grid from "@component/grid/Grid";
import { ProductCard1 } from "@component/product-cards";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import AddToCartButton from "@component/wish-list/AddToCartButton";
import WishListPagination from "@component/wish-list/WishListPagination";

const WishList = () => {
  return (
    <Fragment>
      {/* PAGE TITLE AREA */}
      <DashboardPageHeader
        title="My Wish List"
        iconName="heart_filled"
        button={<AddToCartButton />}
      />

      {/* PRODUCT LIST AREA */}
      <Grid container spacing={6}>
        {db.slice(53, 59).map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              price={item.price}
              title={item.title}
              off={item.discount}
              images={item.images}
              imgUrl={item.thumbnail}
              rating={item.rating || 4}
            />
          </Grid>
        ))}
      </Grid>

      {/* PAGINATION AREA */}
      <WishListPagination />
    </Fragment>
  );
};

export default WishList;
