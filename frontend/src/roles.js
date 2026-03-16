export const Role = {
  LEPPISPJ: 1,
  LEPPISVARAPJ: 2,
  MUOKKAUS: 3,
  AVAIMELLINEN: 4,
  TAVALLINEN: 5,
  JARJESTOPJ: 6,
  JARJESTOVARAPJ: 7
};

export const ROLE_DESCRIPTIONS = {
  [Role.LEPPISPJ]: "Leppis PJ",
  [Role.LEPPISVARAPJ]: "Leppis Vara PJ",
  [Role.MUOKKAUS]: "Muokkaus",
  [Role.AVAIMELLINEN]: "Avaimellinen",
  [Role.TAVALLINEN]: "Tavallinen",
  [Role.JARJESTOPJ]: "Järjestön PJ",
  [Role.JARJESTOVARAPJ]: "Järjestön Vara PJ"
};

export const ROLE_OPTIONS = [
  { value: Role.LEPPISPJ, label: 'Leppis PJ' },
  { value: Role.LEPPISVARAPJ, label: 'Leppis Vara PJ' },
  { value: Role.MUOKKAUS, label: 'Muokkaus' },
  { value: Role.AVAIMELLINEN, label: 'Avaimellinen' },
  { value: Role.TAVALLINEN, label: 'Tavallinen' },
  { value: Role.JARJESTOPJ, label: 'Järjestön PJ' },
  { value: Role.JARJESTOVARAPJ, label: 'Järjestön Vara PJ' }
];