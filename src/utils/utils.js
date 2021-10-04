const getDates = function({ startDate, endDate }) {
  let full_date = new Date(startDate);
  let end_date = new Date(endDate);
  let dates = [];

  while (full_date < end_date) {
    const date = full_date.toISOString().split("T")[0];
    dates.push(date);
    full_date.setDate(full_date.getDate() + 1);
  }

  return dates;
};

export { getDates };
