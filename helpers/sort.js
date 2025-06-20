// Sắp xếp quận theo yêu cầu: quận số (tăng dần) trước, rồi đến quận chữ (alphabet tiếng Việt)
function sortDistricts(districts) {
  const regex = /^Quận (\d+)$/;

  return districts.sort((a, b) => {
    const aMatch = a.districtName.match(regex);
    const bMatch = b.districtName.match(regex);

    if (aMatch && bMatch) {
      return parseInt(aMatch[1]) - parseInt(bMatch[1]);
    }
    if (aMatch) return -1;
    if (bMatch) return 1;

    return a.districtName.localeCompare(b.districtName, 'vi', { sensitivity: 'base' });
  });
}

module.exports = { sortDistricts };
