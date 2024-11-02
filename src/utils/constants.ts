
const navLinks = [
  { title: "Home", link: "/home", secure: false },
  { title: "How It Works", link: "/how-it-works", secure: false },
  { title: "API Docs", link: "/api-docs", secure: false },
];

const profileNavLinks = [
  { title: "My Dashboard", link: "/dashboard", secure: true },
  { title: "My Settings", link: "/settings", secure: true },
  { title: "Help & Feedback", link: "/help-feedback", secure: true },
];

const mobileLoggedInLinks = [
  { title: "Requests", link: "/requests", secure: true },
  { title: "Submit", link: "/home", secure: false },
  { title: "Dashboard", link: "/dashboard", secure: true },
  { title: "Settings", link: "/settings", secure: true },
];

const mobileLoggedOutLinks = [
  { title: "Requests", link: "/home", secure: false },
];

var securePaths: string[] = [];
for (const link of [
  ...navLinks,
  ...profileNavLinks]) {
  if (link.secure) {
    securePaths.push(link.link);
  }
}

export default {
  navLinks,
  profileNavLinks,
  securePaths,
  mobileLoggedInLinks,
  mobileLoggedOutLinks
};