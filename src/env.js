const siteName = process.env.REACT_APP_SITE_FAMILY;

export const FAMILIES = {
  NOLE: "nole",
  ROGAN: "rogan",
  TOKASH: "tokash",
  LOCAL: "local",
  ROGAN_DIR: "rogan-dir",
};

export function getSiteFamily() {
  console.log("SITE_NAME", siteName);
  if (!siteName) {
    return FAMILIES.LOCAL;
  }

  return siteName;
}
