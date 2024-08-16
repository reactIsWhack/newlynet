import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import OnlineUserCard from './OnlineUserCard';

const SearchWindow = ({
  searchQuery,
  windowMounted,
  setIsFocused,
  windowRef,
}) => {
  const { searchResults, searchLoading } = useSelector(selectUser);

  const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
  const unmountedStyle = {
    animation: 'outAnimation 270ms ease-out',
    animationFillMode: 'forwards',
  };

  const searchResultCard = searchResults.map((result, index) => (
    <OnlineUserCard
      {...result}
      key={result._id}
      userData={result}
      advancedPermission={null}
    />
  ));

  return (
    <div
      className="absolute top-full mt-2 min-w-72 max-w-80 bg-gray-800 border border-gray-700 rounded shadow-xl z-50 min-h-20 right-0"
      style={windowMounted ? mountedStyle : unmountedStyle}
      onAnimationEnd={() => {
        if (!windowMounted) setIsFocused(false);
      }}
      ref={windowRef}
    >
      {searchQuery ? (
        searchResults.length && !searchLoading > 0 ? (
          <ul className="overflow-auto max-h-72">
            {searchLoading ? (
              <div className="flex justify-center mt-7">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : (
              searchResultCard
            )}
          </ul>
        ) : (
          <span className="flex justify-center mt-7">No users found</span>
        )
      ) : (
        <span className="flex justify-center mt-7">
          Start typing to find students!
        </span>
      )}
    </div>
  );
};

export default SearchWindow;
