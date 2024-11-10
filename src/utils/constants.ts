
const navLinks = [
  { title: "Home", link: "/map", secure: false },
  { title: "How It Works", link: "/how-it-works", secure: false },
  { title: "API Docs", link: "/api-docs", secure: false },
];

const profileNavLinks = [
  { title: "My Dashboard", link: "/dashboard", secure: true },
  { title: "My Settings", link: "/settings", secure: true },
  { title: "Help & Feedback", link: "/help-feedback", secure: true },
];

const mobileLoggedInLinks = [
  { title: "Dashboard", link: "/dashboard", secure: true, icon: "/assets/images/icons/home.svg" },
  { title: "Requests", link: "/requests", secure: true, icon: "/assets/images/icons/layout-list.svg" },
  { title: "Submit", link: "/map", secure: false, icon: "/assets/images/icons/map.svg" },
  { title: "Settings", link: "/settings", secure: true, icon: "/assets/images/icons/settings_filled.svg" },
];

const mobileLoggedOutLinks = [
  { title: "Requests", link: "/requests", secure: false, icon: "/assets/images/icons/layout-list.svg" },
  { title: "Map", link: "/map", secure: false, icon: "/assets/images/icons/map.svg" },
];

var securePaths: string[] = [];
for (const link of [
  ...navLinks,
  ...profileNavLinks]) {
  if (link.secure) {
    securePaths.push(link.link);
  }
}

const MapConstants = {
  latitudeInitialWidth: 0.0064373,
  longitudeInitialWidth: 0.00786198,
  longitudeOffsetFeatureWindow: 0.0005,  
}

const MapRequestConstants = {
  itemsPerPage: 6,
}

export default {
  navLinks,
  profileNavLinks,
  securePaths,
  mobileLoggedInLinks,
  mobileLoggedOutLinks,
  MapConstants,
  MapRequestConstants
};