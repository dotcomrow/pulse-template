"use client";
import Box from "@component/Box";
import styled from "styled-components";
import Container from "@component/Container";
import { useEffect, useRef, useState } from "react";
import SideNavbar from "@component/sidenav/SideNavbar";
import Section2 from "@sections/furniture-shop/Section2";
import { deviceSize, layoutConstant } from "@utils/constants";
import CategoryNavList from "@models/categoryNavList.model";

const StyledContainer = styled(Container)({
  gap: "1.75rem",
  display: "flex",
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
  sidebarNavList: CategoryNavList[];
}

const ContentBox = ({ sidebarNavList }: Props) => {
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  useEffect(() => {
    if (pageContentRef.current) {
      setSidebarHeight(pageContentRef.current.offsetHeight);
    }
  }, []);
  return (
    <StyledContainer>
      {/* SIDBAR NAVIGATION AREA */}
      <Box className="sidenav">
        <SideNavbar
          lineStyle="dash"
          sidebarStyle="style2"
          navList={sidebarNavList}
          sidebarHeight={sidebarHeight || "85vh"}
        />
      </Box>

      {/* DISCOUNT BANNER AREA */}
      <div className="pageContent" ref={pageContentRef}>
        <Section2 />
      </div>
    </StyledContainer>
  );
};

export default ContentBox;
