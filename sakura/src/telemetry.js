import gtag, { install } from "ga-gtag";

const inProduction = process.env.NODE_ENV === "production";

// can be called multiple times safely
export function startGoogleAnalytics() {
  if (inProduction) {
    install("G-N7YRPF86PY", { send_page_view: false });
  }
}

// https://developers.google.com/gtagjs/reference/event#page_view
export async function pageView(name, pagePath) {
  event("page_view", { page_title: name, page_path: pagePath });
}

// internal
export async function event(name, options) {
  try {
    if (inProduction) {
      gtag("event", name, options);
    } else {
      console.log("gtag:", name, options);
    }
  } catch (e) {
    console.warn("Unable to log app event", name, options, e);
    // do not rethrow so the app experience is not interrupted no matter what
  }
}
