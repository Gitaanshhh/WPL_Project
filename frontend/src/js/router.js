import { renderHome } from "./views/home.js";

const routes = {
  "/": renderHome,
};

export function initRouter() {
  window.addEventListener("hashchange", loadRoute);
  loadRoute();
}

function loadRoute() {
  const path = location.hash.replace("#", "") || "/";
  const view = document.getElementById("view");

  const render = routes[path] || renderHome;
  view.innerHTML = "";
  render(view);
}
