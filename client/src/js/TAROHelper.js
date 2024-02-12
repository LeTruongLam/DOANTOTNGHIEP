import moment from "moment";

export const formatDate = (date) => {
  return moment(new Date(date)).format("DD/MM/YYYY");
};

export const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  export  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength) + "...";
  };
// Các hàm khác...