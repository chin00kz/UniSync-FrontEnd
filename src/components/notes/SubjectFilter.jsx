import React from 'react';

/**
 * SubjectFilter — horizontally scrolling pill buttons to filter notes by subject code.
 * Props:
 *   value      {string}
 *   onChange   {fn}  (value: string) => void
 *   subjects   {object}  { "Year 1": [{code, name}], ... }
 *   selectedYear {string | null}
 */
export default function SubjectFilter({ value, onChange, subjects = {}, selectedYear }) {
  const allSubjects = selectedYear
    ? (subjects[selectedYear] || [])
    : Object.values(subjects).flat();

  // Filter unique codes if flat() has duplicates
  const uniqueSubjects = [];
  const seenInfo = new Set();
  for (const sub of allSubjects) {
     if (!seenInfo.has(sub.code)) {
         seenInfo.add(sub.code);
         uniqueSubjects.push(sub);
     }
  }

  // To hide scrollbar cleanly we can wrap or just let native behavior handle it cleanly, wait it looks fine natively
  return (
    <div className="dropdown-container animate-fade-in">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="All Subjects">All Subjects</option>
        {uniqueSubjects.map((sub) => (
          <option key={sub.code} value={sub.code}>
            {sub.code} — {sub.name}
          </option>
        ))}
      </select>
    </div>
  );
}
