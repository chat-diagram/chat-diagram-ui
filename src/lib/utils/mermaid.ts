export const getDslId = (renderedId: string) => {
  // flowchart-b-11 → B
  // flowchart-E-22 → E
  const match = renderedId.match(/flowchart-(.+?)-\d+$/i);
  return match ? match[1].toUpperCase() : renderedId;
};
