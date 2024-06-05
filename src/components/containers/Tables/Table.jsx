import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

function Table({ columns, rows }) {
  const renderColumns = columns.map(({ name }) => {
    return (
      <th
        key={name}
        className="py-2 px-4 text-sm font-medium text-gray-900 border-b border-light text-left"
      >
        {name.toUpperCase()}
      </th>
    );
  });

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;

    const tableRow = columns.map(({ name }) => {
      return (
        <td
          key={uuidv4()}
          className="py-2 px-4 border-b border-light text-sm text-gray-500 text-left"
        >
          {row[name]}
        </td>
      );
    });

    return <tr key={rowKey}>{tableRow}</tr>;
  });

  return useMemo(() => (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>{renderColumns}</tr>
        </thead>
        <tbody>{renderRows}</tbody>
      </table>
    </div>
  ), [columns, rows]);
}

export default Table;
