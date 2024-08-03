"use client";
import Sticky from "@component/sticky";
import Navbar from "@component/navbar/SaleNavbar";
import { useCallback, useState } from "react";
import Box from "@component/Box";

type Props = {
  saleCategoryList: { icon: string; title: string }[];
};

const SaleNavbar = ({ saleCategoryList }: Props) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed: boolean) => setIsFixed(fixed), []);

  return (
    <Sticky fixedOn={0} onSticky={toggleIsFixed}>
      {!isFixed ? (
        <Box display="none" />
      ) : (
        <Navbar saleCategoryList={saleCategoryList} />
      )}
    </Sticky>
  );
};

export default SaleNavbar;
