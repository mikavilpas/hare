export default function externalLinksAsNewTabs() {
    document.querySelectorAll(".external-search a.external")
        .forEach(a => a.target = "_blank");
}
