import Script from "next/script";
import { FC, Fragment } from "react";

const GoogleAnalytics: FC = () => {
  const MARKUP = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8MHBD6Z0FG');
  `;

  return (
    <Fragment>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8MHBD6Z0FG"
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: MARKUP }}
      />
    </Fragment>
  );
};

export default GoogleAnalytics;
