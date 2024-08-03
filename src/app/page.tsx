import Box from "@component/Box";
import Footer from "@sections/landing/Footer";
import Section1 from "@sections/landing/Section1";
import Section2 from "@sections/landing/Section2";
import Section3 from "@sections/landing/Section3";
import Section4 from "@sections/landing/Section4";
import Section5 from "@sections/landing/Section5";

export const runtime = 'edge';

export default function Home() {
  return (
    <Box id="top" overflow="hidden" bg="gray.white">
      <Section1 />
      <Section2 />

      <Section5 />
      <Section3 />
      <Section4 />

      <Footer />
    </Box>
  );
}
