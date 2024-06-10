import moment from "moment";

function CombineDateToISO(dateString, timeString) {
  const dateTimeString = `${dateString}, ${timeString}`;
  const isoDateTime = moment.utc(dateTimeString, "MM/DD/YYYY, HH:mm A").toISOString();
  return isoDateTime;
}

export default CombineDateToISO;
