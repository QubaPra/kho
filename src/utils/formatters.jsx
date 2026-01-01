// Wspólne funkcje formatujące używane w wielu komponentach

export const monthMap = {
  styczeń: "01",
  luty: "02",
  marzec: "03",
  kwiecień: "04",
  maj: "05",
  czerwiec: "06",
  lipiec: "07",
  sierpień: "08",
  wrzesień: "09",
  październik: "10",
  listopad: "11",
  grudzień: "12",
};

export const formatStatus = (status) => {
  if (!status) return "";
  const match = status.match(
    /^(Otwarta|Zamknięta) rozkazem ([^<]+) <(.+?)>(.*)$/
  );
  if (match) {
    const [, type, orderNumber, orderLink, additionalText] = match;
    return (
      <span>
        {type} rozkazem{" "}
        <a
          className="underline hover:text-blue-500 dark:hover:text-blue-400"
          href={orderLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {orderNumber}
        </a>
        {additionalText}
      </span>
    );
  }
  return status;
};

export const getAgeSuffix = (age) => {
  if (age === 1) return "rok";
  if (age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20))
    return "lata";
  return "lat";
};

export const getLatestEndDate = (tasks) => {
  if (tasks.length === 0) return "";
  const dates = tasks
    .map((task) => {
      if (!task.end_date) {
        return NaN;
      }
      const [monthName, year] = task.end_date.split(" ");
      const month = monthMap[monthName.toLowerCase()];
      if (!month || !year) {
        return NaN;
      }
      return new Date(`${year}-${month}-01`);
    })
    .filter((date) => !isNaN(date));
  if (dates.length === 0) return "";
  const latestDate = new Date(Math.max(...dates));
  return latestDate.toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
  });
};
