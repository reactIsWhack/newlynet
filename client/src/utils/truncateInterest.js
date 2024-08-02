const truncateInterest = (interest, limit) => {
  if (interest.length > limit) {
    return interest.substring(0, limit) + '...';
  }

  return interest;
};

export default truncateInterest;
