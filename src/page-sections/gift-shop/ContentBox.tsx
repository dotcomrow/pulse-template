"use client";
import Box from "@component/Box";
import styled from "styled-components";
import PageContainer from "@component/Container";
import { useEffect, useRef, useState } from "react";
import { deviceSize, layoutConstant } from "@utils/constants";
import SideNavbar from "@component/sidenav/SideNavbar";
import Section2 from "@sections/gift-shop/Section2";
import Section3 from "@sections/gift-shop/Section3";
import Section4 from "@sections/gift-shop/Section4";
import Service from "@models/service.model";
import Category from "@models/category.model";
import CategoryNavList from "@models/categoryNavList.model";

// styled component
const StyledContainer = styled(PageContainer)({
  gap: "1.75rem",
  display: "flex",
  marginBottom: "5rem",
  padding: "0 !important",
  ".sidenav": {
    top: 0,
    bottom: 0,
    position: "relative",
    transition: "all 350ms ease-in-out",
    width: layoutConstant.grocerySidenavWidth,
    minWidth: layoutConstant.grocerySidenavWidth,
    [`@media (max-width:${deviceSize.md}px)`]: { display: "none" },
  },

  "& .pageContent": {
    left: "unset",
    position: "relative",
    width: `calc(100% - ${layoutConstant.grocerySidenavWidth})`,
    [`@media (max-width:${deviceSize.md}px)`]: { width: "100%", marginLeft: 0 },
  },
});

interface Props {
  serviceList: Service[];
  topCategories: Category[];
  categoryNavigation: CategoryNavList[];
}

const ContentBox = (props: Props) => {
  const { serviceList, topCategories, categoryNavigation } = props;
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  useEffect(() => {
    if (pageContentRef.current) {
      setSidebarHeight(pageContentRef.current.offsetHeight);
    }
  }, []);

  return (
    <StyledContainer>
      {/* SIDEBAR NAVIGATION AREA */}
      <Box className="sidenav">
        <SideNavbar
          lineStyle="dash"
          sidebarStyle="style2"
          navList={categoryNavigation}
          sidebarHeight={sidebarHeight || "85vh"}
        />
      </Box>

      <div className="pageContent" ref={pageContentRef}>
        {/* SERVICES AREA */}
        <Section2 services={serviceList} />

        {/* DISCOUNT BANNER AREA */}
        <Section3 />

        {/* TOP CATEGORIES AREA */}
        <Section4 categoryList={topCategories as Category[]} />
      </div>
    </StyledContainer>
  );
};

export default ContentBox;
