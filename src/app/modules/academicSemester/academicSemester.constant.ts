export const academicSemesterMonths = [
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
] as const;

export const academicSemesterTitles = ["Autumn", "Summer", "Fall"] as const;

export const academicSemesterCodes = ["01", "02", "03"];

export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: "01",
  Summer: "02",
  Fall: "03",
};

export const academicSemesterSearchableFields = ["title", "code", "startMonth"];
export const academicSemesterFilterableFields = [
  "search",
  "title",
  "code",
  "startMonth",
  "year",
];
