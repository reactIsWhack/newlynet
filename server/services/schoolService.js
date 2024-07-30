const getSchool = async (schoolQuery) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${schoolQuery}&types=school&key=${process.env.API_KEY}`
  );
  const { predictions } = await response.json();
  console.log(predictions[0]);
  return {
    fullDescription: predictions[0].description,
    formattedName: predictions[0].structured_formatting.main_text,
    schoolId: predictions[0].place_id,
  };
};

module.exports = getSchool;
