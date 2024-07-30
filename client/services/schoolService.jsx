const getSchool = async (schoolQuery) => {
  const options = {
    fields: ['formatted_address', 'geometry', 'name'],
    strictBounds: false,
  };
  const autocomplete = new google.maps.places.Autocomplete(schoolQuery);

  return autocomplete;
};

export default getSchool;
