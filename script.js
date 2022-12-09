"use strict";

let holidays = null;

const url =
  "https://script.google.com/macros/s/AKfycbxfNQF1SZ7uGgN6NHpBigDPaylZtSZfaKbGKSY434A_6ZZ-WARcSSYmS6jFQxmgDIwQ/exec";

const init = () => {
  let date = new Date();

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

        const isHoliday =
          holidays.findIndex((r) => {
            return r.start === newDateString;
          }) !== -1
            ? " holiday"
            : "";

        return `<div class="day${dayType}${isToday}${isHoliday}"   
    data-date="${day}">${newDate.getDate()}</div>`;
      })
      .join("");

    document.querySelector(".date h1").textContent = months[date.getMonth()];
    document.querySelector(".date p").textContent = date.toDateString();
    document.querySelector(".days").innerHTML = innerHtml;
    //   console.log(days);
  };

  document.querySelector(".calendar").addEventListener("click", (e) => {
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
  });

  renderCalendar();
};

const getHolidays = async () => {
  try {
    const res = await fetch(url);

    holidays = await res.json();

    holidays.forEach((holiday) => {
      const [yr, mo, dy] = holiday.start.split("-");
      holiday.date = new Date(yr, parseInt(mo) - 1, dy, 0, 0, 0);
    });
    // console.log(holidays);
    holidays.sort((a, b) => a.start - b.start);
  } catch (err) {
  } finally {
    init();
  }
};

document.addEventListener("DOMContentLoaded", getHolidays);
