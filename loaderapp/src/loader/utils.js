export function loadJs(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = () => {
      console.log(`Loaded file ${url}"`);
      resolve(link);
    };
    script.onerror = () => reject(new Error(`Style load error for ${src}`));
    document.head.appendChild(script);
  });
}

export function loadCss(src) {
  return new Promise(function (resolve, reject) {
    let link = document.createElement("link");
    link.href = src;
    link.rel = "stylesheet";
    link.id = "sakura-customizations-css";

    link.onload = () => {
      console.log(`Loaded file ${src}"`);
      resolve(link);
    };
    link.onerror = () => reject(new Error(`Style load error for ${src}`));

    document.head.append(link);
  });
}

export const base = "https://sp3ctum.github.io/sakura-paris-customizations";
