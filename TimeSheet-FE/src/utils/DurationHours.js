import moment from "moment";

const DurationHours = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const hours = moment.utc(moment(end, "HH:mm:ss").diff(moment(start, "HH:mm:ss"))).format("hh");
  const minutes = moment.utc(moment(end, "HH:mm:ss").diff(moment(start, "HH:mm:ss"))).format("mm");

  return hours + " Jam " + minutes + " Menit";
};

export default DurationHours;
