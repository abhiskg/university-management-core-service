export const facultyDesignation = ["Professor", "Lecturer"] as const;

export const facultySearchableFields = [
  "id",
  "email",
  "contactNo",
  "name.firstName",
  "name.lastName",
];

export const facultyFilterableFields = [
  "search",
  "id",
  "email",
  "contactNo",
  "emergencyContactNo",
  "designation",
];
