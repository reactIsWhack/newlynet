import React from 'react';

const SearchWindow = ({
  searchResults,
  searchQuery,
  windowMounted,
  setIsFocused,
}) => {
  const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
  const unmountedStyle = {
    animation: 'outAnimation 270ms ease-out',
    animationFillMode: 'forwards',
  };

  return (
    <div
      className="absolute top-full mt-2 min-w-64 max-w-80 bg-gray-800 border border-gray-700 rounded shadow-xl z-50 min-h-20 right-0"
      style={windowMounted ? mountedStyle : unmountedStyle}
      onAnimationEnd={() => {
        if (!windowMounted) setIsFocused(false);
      }}
    >
      {searchQuery ? (
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-700 text-gray-200 cursor-pointer"
            >
              {result}
            </li>
          ))}
        </ul>
      ) : (
        <span className="flex justify-center mt-7">
          Start typing to find students!
        </span>
      )}
    </div>
  );
};

export default SearchWindow;
