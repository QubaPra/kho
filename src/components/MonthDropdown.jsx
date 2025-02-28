import React, { useState, useEffect, useRef } from "react";

const MonthDropdown = ({ selectedDate, onSelectDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isYearSelection, setIsYearSelection] = useState(false);
  const [date, setDate] = useState(selectedDate);
  const [prevDate, setPrevDate] = useState(selectedDate);
  const dropdownRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = [
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
  ];
  const months = [
    "styczeń",
    "luty",
    "marzec",
    "kwiecień",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpień",
    "wrzesień",
    "październik",
    "listopad",
    "grudzień",
  ];
  const shortMonths = [
    "sty",
    "lut",
    "mar",
    "kwi",
    "maj",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paź",
    "lis",
    "gru",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setDate(prevDate); // Przywróć poprzednią datę
        setIsYearSelection(false); // Resetuj wybór roku
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, prevDate]);

  const handleMonthClick = (month, fullMonth) => {
    setDate(`${fullMonth}`);
    setIsYearSelection(true);
  };

  const handleYearClick = (year) => {
    const newDate = `${date} ${year}`;
    setDate(newDate);
    setPrevDate(newDate); // Zaktualizuj prevDate po wybraniu nowej daty
    onSelectDate(newDate);
    setIsOpen(false);
    setIsYearSelection(false);
  };

  const handleButtonClick = () => {
    if (!isOpen) {
      setPrevDate(date); // Zapisz poprzednią datę przed otwarciem dropdownu
    }
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsYearSelection(false); // Resetuj wybór roku przy ponownym otwarciu
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between"
      >
        <p>{date}</p>
        <span className="material-symbols-outlined">calendar_month</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          {isYearSelection ? (
            <div className="grid grid-cols-2 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {shortMonths.map((shortMonth, index) => (
                <button
                  key={shortMonth}
                  onClick={() => handleMonthClick(shortMonth, months[index])}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {shortMonth}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthDropdown;
