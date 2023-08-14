const siteName = process.env.SITE_FAMILY;

export const FAMILIES = {
  NOLE: 'nole',
  ROGAN: 'rogan',
  TOKASH: 'tokash',
  LOCAL: 'local',
};

export function getSiteFamily() {
  if (!siteName) {
    return FAMILIES.LOCAL
  }

  return siteName;
}
