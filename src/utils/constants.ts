
const navLinks = [
  { title: "Home", link: "/home", secure: false },
  { title: "API Docs", link: "/api-docs", secure: false },
];

const profileNavLinks = [
  { title: "My Dashboard", link: "/dashboard", secure: true },
  { title: "My Settings", link: "/settings", secure: true },
  { title: "Help & Feedback", link: "/help-feedback", secure: true },
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
};