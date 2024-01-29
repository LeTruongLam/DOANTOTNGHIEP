import { format } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "dd/MM/yyyy");
};

export const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };
// Các hàm khác...