window.addEventListener("load", () => {
  window.__DATA__.externalSearchSites.push({
    name: "Jisho sentences",
    url: "https://jisho.org/search/%s%20%23sentences",
    iconUrl: "/dict/icons/jisho.png",
  });
  console.log("Added Jisho sentence search");
});
