import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { addToast } from "@heroui/react";

import { AIRTEL_NO, BASE_URL, MTN_NO, ZAMTEL_NO } from "./constants";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const notify = ({
  title,
  description,
  color = "default",
  ...config
}) => {
  return addToast({
    title,
    description,
    color,
    ...config,
  });
};

export function formatCurrency(amount) {
  const currencyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZMW",
    minimumFractionDigits: 2,
  });

  return currencyFormat.format(amount || 0);
}

export const formatActivityData = (activityLog, isNotReverse = true) => {
  const groupedData = {};

  activityLog?.forEach((activity) => {
    activity.data?.forEach((item) => {
      const created_at = new Date(item.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groupedData[created_at]) {
        groupedData[created_at] = [];
      }

      groupedData[created_at].push(item);
    });
  });

  const result = Object.keys(groupedData).map((date) => ({
    title: date,
    data: isNotReverse ? groupedData[date] : groupedData[date].reverse(),
  }));

  return result;
};

export function formatDate(inputDate, dateStyle = "") {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const date = new Date(inputDate);

  const formattedDate = date.toLocaleDateString("en", options);

  const [month, day, year] = formattedDate.split(" ");

  const YYYY = date.getFullYear();

  const MM = String(date.getMonth() + 1).padStart(2, "0");

  const DD = String(date.getDate()).padStart(2, "0");

  // Format the date as "YYYY-MM-DD"
  if (dateStyle === "YYYY-MM-DD") return `${YYYY}-${MM}-${DD}`;

  // Format the date as "DD-MM-YYYY"
  if (dateStyle === "DD-MM-YYYY") return `${DD}-${MM}-${YYYY}`;

  return `${parseInt(day)}-${month}-${year}`;
}

export function maskString(string, firstCharacters = 0, lastCharacters = 6) {
  if (string?.length < 10) {
    return string;
  }

  const first = string?.slice(0, firstCharacters);
  const last = string?.slice(string.length - lastCharacters);

  return `${first} *****${last}`;
}

export function getUserInitials(name) {
  return name
    ?.split(" ")
    .map((i) => i[0])
    .join("");
}

export function capitalize(str = "") {
  return str?.toString()?.charAt(0)?.toUpperCase() + str?.toString()?.slice(1);
}

export function isValidZambianMobileNumber(mobileNumber) {
  let number = mobileNumber?.replaceAll(/\D/g, "").toString();

  if (number?.length < 10 || number?.length > 12) {
    return false;
  }

  if (number?.length == 11) return false;

  if (MTN_NO.test(number) || AIRTEL_NO.test(number) || ZAMTEL_NO.test(number))
    return true; // Valid Zambian mobile number

  return false; // INvalid Zambian mobile number
}

export function getFormattedZambianMobileNumber(mobileNumber) {
  if (!isValidZambianMobileNumber(mobileNumber)) {
    return {
      provider: null,
      mobileNumber: "Invalid Number",
    }; // Invalid Zambian mobile number
  }

  let provider = null;

  if (MTN_NO.test(mobileNumber)) {
    provider = "MTN ";
  } else if (AIRTEL_NO.test(mobileNumber)) {
    provider = "Airtel ";
  } else if (ZAMTEL_NO.test(mobileNumber)) {
    provider = "Zamtel";
  }

  return {
    provider,
    mobileNumber: mobileNumber.replace("+", ""),
  };
}

export function isValidNRCNo(input) {
  // REMOVE ALL NON-DIGITS
  const formattedID = input?.trim()?.replaceAll(/\D/g, "");

  if (
    (formattedID?.charAt(formattedID.length - 1) === "1" ||
      formattedID?.charAt(formattedID.length - 1) === "2" ||
      formattedID?.charAt(formattedID.length - 1) === "3") &&
    formattedID?.length === 9
  ) {
    return true;
  }

  return false;
}

export function formatNRCNumber(input) {
  // REMOVE ALL NON-DIGITS
  let cleanedInput = input?.trim().replaceAll(/\D/g, "");

  // Insert slashes at the correct positions
  if (cleanedInput?.length > 6) {
    cleanedInput = `${cleanedInput.slice(0, 6)}/${cleanedInput.slice(6)}`;
  }

  if (cleanedInput?.length > 9) {
    cleanedInput = `${cleanedInput.slice(0, 9)}/${cleanedInput.slice(9, 10)}`;
  }

  // Update the state with the formatted value
  return cleanedInput;
}

export function syntaxHighlight(json) {
  if (!json) return ""; //no JSON from response

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }

      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

export function generateRandomString(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);

    randomString += characters[randomIndex];
  }

  return randomString;
}

export function assertValue(v, errorMessage) {
  if (v === undefined || !v) {
    throw new Error(errorMessage);
  }

  return v;
}
