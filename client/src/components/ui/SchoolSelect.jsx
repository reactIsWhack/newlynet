import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

const SchoolSelect = ({
  setFormData,
  formData,
  schoolQuery,
  setSchoolQuery,
}) => {
  const handleSelect = async (value, placeId) => {
    // Set form data with the full suggestion object or specific fields
    setSchoolQuery(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      school: {
        description: value,
        schoolId: placeId,
      },
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      grade: Number(e.target.value),
    }));
  };

  return (
    <div className="flex items-center gap-3 ">
      <div className="w-2/3 ">
        <label className="label">
          <span className="text-base label-text">School</span>
        </label>
        <AutocompleteResults
          schoolQuery={schoolQuery}
          onSelect={handleSelect}
          setSchoolQuery={setSchoolQuery}
          formData={formData}
        />
      </div>
      <div className="w-1/3">
        <label className="label p-2">
          <span className="text-base label-text">Grade</span>
        </label>
        <input
          type="number"
          placeholder="Enter grade"
          className="w-full input input-bordered h-10"
          min={5}
          max={12}
          onChange={handleChange}
          value={formData.grade}
        />
      </div>
    </div>
  );
};

const AutocompleteResults = ({
  schoolQuery,
  setSchoolQuery,
  onSelect,
  formData,
}) => {
  return (
    <PlacesAutocomplete
      value={schoolQuery}
      onChange={setSchoolQuery}
      onSelect={(value, placeId) => onSelect(value, placeId)}
      searchOptions={{
        types: ['school', 'university'],
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="relative">
          <input
            {...getInputProps({
              type: 'text',
              className: 'w-full input input-bordered h-10 text-gray-200',
              placeholder: 'Enter school',
            })}
            value={schoolQuery}
          />
          {schoolQuery && (
            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-gray-700 border-gray-600 shadow-lg z-10">
              {loading ? <div className="text-gray-300">Loading...</div> : null}
              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? '#575757' : '#333',
                  color: '#fff',
                  padding: '10px',
                  cursor: 'pointer',
                };

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, { style })}
                    key={suggestion.placeId}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default SchoolSelect;
