"use strict";

let holidays = null;

const url =
  "https://script.google.com/macros/s/AKfycbxWjMXwzkOdChHbxR9RBXtUAdwCLZkNXsxkx6kumdUmIYxb5rjAQq3xrEIHdOtAFJXhcA/exec";

const init = () => {
  let date = new Date();
  const calendar = document.querySelector(".calendar");
  const monthContainer = document.querySelector(".date h1");
  const dateContainer = document.querySelector(".date p");
  const daysContainer = document.querySelector(".days");

  const renderCalendar = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0);

    let days = Array.from({ length: firstDay.getDay() }, (_, i) =>
      new Date(firstDay).setDate(-i)
    ).reverse();

    days = days.concat(
      Array.from({ length: lastDay.getDate() }, (_, i) =>
        new Date(firstDay).setDate(i + 1)
      )
    );

    days = days.concat(
      Array.from({ length: 42 - days.length }, (_, i) =>
        new Date(lastDay).setDate(lastDay.getDate() + i + 1)
      )
    );

    const padString = (val) => {
      return val.toString().padStart(2, 0);
    };

    const innerHtml = days
      .map((day, dayIndex) => {
        const newDate = new Date(day);
        const newDateString = `${newDate.getFullYear()}-${padString(
          newDate.getMonth() + 1
        )}-${padString(newDate.getDate())}`;
        const today = new Date();
        const todayString = `${today.getFullYear()}-${padString(
          today.getMonth() + 1
        )}-${padString(today.getDate())}`;
        const dayType =
          newDate < firstDay
            ? " day--previous"
            : newDate > lastDay
            ? " day--next"
            : "";

        const isToday = todayString === newDateString ? " today" : "";

        const isHoliday = "";
        //   holidays.findIndex((r) => {
        //     return r.start === newDateString;
        //   }) !== -1
        //     ? " holiday"
        //     : "";

        return `<div class="day${dayType}${isToday}${isHoliday}"   
    data-date="${day}">${newDate.getDate()}</div>`;
      })
      .join("");

    monthContainer.textContent = months[date.getMonth()];

    dateContainer.textContent = date.toDateString();
    daysContainer.innerHTML = innerHtml;
    calendar.classList.add("calendar--open");
    //   console.log(days);
  };

  calendar.addEventListener("click", (e) => {
    const el = e.target;
    if (el.closest(".month__prev")) {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
      return;
    }

    if (el.closest(".month__next")) {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
      return;
    }

    if (el.closest(".day")) {
      if (
        date.getMonth ===
        new Date(parseFloat(el.closest(".day").dataset.date)).getMonth()
      ) {
        date = new Date(parseFloat(el.closest(".day").dataset.date));

        document.querySelector(".date p").textContent = date.toDateString();
      } else {
        date = new Date(parseFloat(el.closest(".day").dataset.date));

        renderCalendar();
      }
    }

    if (el.closest(".button__cancel")) {
      calendar.classList.remove("calendar--open");
    }
  });

  renderCalendar();
};

/* const getHolidays = async () => {
  try {
    const res = await fetch(url);

    holidays = await res.json();

    init();
  } catch (err) {
  } finally {
  }
}; */

document.addEventListener("DOMContentLoaded", init);
