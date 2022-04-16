const isShowMore = ({ limit, offsetCount }, allUserNotes) => {
  if (!allUserNotes.length) {
    return false;
  }

  const fullCount = Number(allUserNotes[0].full_count);
  const showedPagesCount = Number(limit) + Number(offsetCount);

  return fullCount > showedPagesCount;
};

module.exports = isShowMore;
