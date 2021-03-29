export const getPlaceData = (url) => {
  const nameMatch = url?.match(/(?<=\/maps\/place\/)(.*?)(?=\/)/gi);
  const coordMatch = url?.match(/(?<=\/@)(.*?)(?=\/data)/gi);
  return {
    name: nameMatch ? nameMatch[0] : null,
    coords: coordMatch ? coordMatch[0].split(",") : null,
  };
};

export const gmapsUrlValidator = (Rule) =>
  Rule.required().custom((url) => {
    const { name, coords } = getPlaceData(url);
    return (
      (name != null && coords != null) ||
      "Needs to be a valid maps URL of a specific place"
    );
  });
