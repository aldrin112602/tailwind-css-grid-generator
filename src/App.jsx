import React, { useState, useEffect } from "react";
import CodeBlock from "./components/CodeBlock";
import Footer from "./components/Footer";


const App = () => {
  const [columns, setColumns] = useState(8);
  const [rows, setRows] = useState(8);
  const [columnGap, setColumnGap] = useState(0);
  const [rowGap, setRowGap] = useState(0);
  const [grid, setGrid] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [areas, setAreas] = useState([]);
  const [nextAreaId, setNextAreaId] = useState(1);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isResponsive, setIsResponsive] = useState(true);
  const [breakpoints, setBreakpoints] = useState({
    sm: true,
    md: true,
    lg: true,
    xl: true,
  });

  // Initialize grid when rows or columns change
  useEffect(() => {
    const newGrid = Array(rows)
      .fill()
      .map(() => Array(columns).fill(0));
    setGrid(newGrid);
    setAreas([]);
    setNextAreaId(1);
  }, [rows, columns]);

  // Convert a cell position to grid coordinates
  const getCellCoords = (row, col) => ({ row, col });

  // Get min/max row/col from start and end points
  const getAreaBounds = (start, end) => {
    if (!start || !end) return null;

    const startRow = Math.min(start.row, end.row);
    const endRow = Math.max(start.row, end.row);
    const startCol = Math.min(start.col, end.col);
    const endCol = Math.max(start.col, end.col);

    return { startRow, endRow, startCol, endCol };
  };

  // Handle cell mouse down
  const handleMouseDown = (row, col) => {
    // Check if clicking on an existing area
    const clickedAreaId = getAreaIdAtCell(row, col);

    if (clickedAreaId) {
      setSelectedAreaId(clickedAreaId);
      return;
    }

    setIsDragging(true);
    setStartCell(getCellCoords(row, col));
    setEndCell(getCellCoords(row, col));
  };

  // Handle cell mouse enter during drag
  const handleMouseEnter = (row, col) => {
    if (isDragging) {
      setEndCell(getCellCoords(row, col));
    }
  };

  // Handle mouse up to complete the area
  const handleMouseUp = () => {
    if (isDragging && startCell && endCell) {
      const bounds = getAreaBounds(startCell, endCell);

      // Check if area overlaps with existing areas
      let hasOverlap = false;
      for (const area of areas) {
        if (doAreasOverlap(bounds, area)) {
          hasOverlap = true;
          break;
        }
      }

      if (!hasOverlap && bounds) {
        const newArea = {
          id: nextAreaId,
          name: `div${nextAreaId}`,
          ...bounds,
        };

        setAreas([...areas, newArea]);
        setNextAreaId(nextAreaId + 1);
        setSelectedAreaId(newArea.id);
      }
    }

    setIsDragging(false);
  };

  // Check if mouse has left the grid
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Check if two areas overlap
  const doAreasOverlap = (bounds1, area) => {
    if (!bounds1) return false;

    return !(
      bounds1.endRow < area.startRow ||
      bounds1.startRow > area.endRow ||
      bounds1.endCol < area.startCol ||
      bounds1.startCol > area.endCol
    );
  };

  // Get the area ID at a specific cell
  const getAreaIdAtCell = (row, col) => {
    for (const area of areas) {
      if (
        row >= area.startRow &&
        row <= area.endRow &&
        col >= area.startCol &&
        col <= area.endCol
      ) {
        return area.id;
      }
    }
    return null;
  };

  // Check if a cell is in the currently dragged selection
  const isCellInCurrentSelection = (row, col) => {
    if (!isDragging || !startCell || !endCell) return false;

    const bounds = getAreaBounds(startCell, endCell);
    if (!bounds) return false;

    return (
      row >= bounds.startRow &&
      row <= bounds.endRow &&
      col >= bounds.startCol &&
      col <= bounds.endCol
    );
  };

  // Remove the selected area
  const removeSelectedArea = () => {
    if (selectedAreaId) {
      setAreas(areas.filter((area) => area.id !== selectedAreaId));
      setSelectedAreaId(null);
    }
  };

  // Helper to get tailwind gap class
  const getTailwindGap = (gap) => {
    if (gap === 0) return "";
    if (gap <= 1) return "gap-px";
    if (gap <= 2) return "gap-0.5";
    if (gap <= 4) return "gap-1";
    if (gap <= 6) return "gap-1.5";
    if (gap <= 8) return "gap-2";
    if (gap <= 12) return "gap-3";
    if (gap <= 16) return "gap-4";
    if (gap <= 20) return "gap-5";
    if (gap <= 24) return "gap-6";
    if (gap <= 32) return "gap-8";
    return "gap-10";
  };

  // Helper to get tailwind columns class
  const getTailwindColumns = (cols) => {
    if (cols <= 12) return `grid-cols-${cols}`;
    return "grid-cols-12";
  };

  // Generate Tailwind CSS classes for the current grid
  const generateTailwindCSS = () => {
    if (areas.length === 0) return "";

    let containerClasses = "grid ";

    // Add column classes
    if (isResponsive) {
      containerClasses += "grid-cols-1 ";
      if (breakpoints.sm)
        containerClasses += `sm:${getTailwindColumns(columns)} `;
      if (breakpoints.md)
        containerClasses += `md:${getTailwindColumns(columns)} `;
      if (breakpoints.lg)
        containerClasses += `lg:${getTailwindColumns(columns)} `;
      if (breakpoints.xl)
        containerClasses += `xl:${getTailwindColumns(columns)} `;
    } else {
      containerClasses += `${getTailwindColumns(columns)} `;
    }

    // Add gaps
    const colGapClass = getTailwindGap(columnGap);
    const rowGapClass = getTailwindGap(rowGap);

    if (colGapClass && rowGapClass && colGapClass === rowGapClass) {
      containerClasses += `${colGapClass} `;
    } else {
      if (colGapClass)
        containerClasses += `${colGapClass.replace("gap", "gap-x")} `;
      if (rowGapClass)
        containerClasses += `${rowGapClass.replace("gap", "gap-y")} `;
    }

    // Generate area classes
    let areaClasses = [];
    areas.forEach((area) => {
      const areaWidth = area.endCol - area.startCol + 1;
      const areaHeight = area.endRow - area.startRow + 1;

      let areaClass = `.${area.name} { `;

      // Column span
      if (isResponsive) {
        areaClass += `@apply col-span-1 `;
        if (breakpoints.sm) areaClass += `sm:col-span-${areaWidth} `;
        if (breakpoints.md) areaClass += `md:col-span-${areaWidth} `;
        if (breakpoints.lg) areaClass += `lg:col-span-${areaWidth} `;
        if (breakpoints.xl) areaClass += `xl:col-span-${areaWidth} `;
      } else {
        areaClass += `@apply col-span-${areaWidth} `;
      }

      // Row span
      areaClass += `row-span-${areaHeight} `;

      // Column start
      if (isResponsive) {
        areaClass += `col-start-1 `;
        if (breakpoints.sm) areaClass += `sm:col-start-${area.startCol + 1} `;
        if (breakpoints.md) areaClass += `md:col-start-${area.startCol + 1} `;
        if (breakpoints.lg) areaClass += `lg:col-start-${area.startCol + 1} `;
        if (breakpoints.xl) areaClass += `xl:col-start-${area.startCol + 1} `;
      } else {
        areaClass += `col-start-${area.startCol + 1} `;
      }

      // Row start
      areaClass += `row-start-${area.startRow + 1};`;
      areaClass += ` }`;

      areaClasses.push(areaClass);
    });

    return (
      <>
        <CodeBlock
          code={
            `<div class="${containerClasses.trim()}">\n` +
            areas
              .map(
                (area) =>
                  `  <div class="${area.name}"><!-- Content for ${area.name} --></div>`
              )
              .join("\n") +
            "\n</div>\n\n"
          }
          language="html"
        />
        <CodeBlock
          code={"/* CSS Styles for Grid Areas */\n" + areaClasses.join("\n")}
          language="css"
        />
      </>
    );
  };

  // Reset the grid
  const resetGrid = () => {
    const newGrid = Array(rows)
      .fill()
      .map(() => Array(columns).fill(0));
    setGrid(newGrid);
    setAreas([]);
    setNextAreaId(1);
    setSelectedAreaId(null);
  };

  // Get cell background color based on area
  const getCellStyle = (row, col) => {
    const areaId = getAreaIdAtCell(row, col);

    if (areaId) {
      // Selected area should be highlighted
      if (areaId === selectedAreaId) {
        return {
          backgroundColor: `hsl(120, 60%, ${20 + ((areaId * 10) % 30)}%)`,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          opacity: 1,
        };
      }
      return {
        backgroundColor: `hsl(${(areaId * 40) % 360}, 60%, ${
          20 + ((areaId * 10) % 30)
        }%)`,
        border: "1px solid rgba(255, 255, 255, 0.2)",
      };
    }

    if (isCellInCurrentSelection(row, col)) {
      return {
        backgroundColor: "rgba(100, 200, 255, 0.5)",
        border: "1px dashed #8ff",
      };
    }

    return {
      backgroundColor: "transparent",
      border: "1px dashed rgba(255, 255, 255, 0.2)",
    };
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-center mb-8">
          <div className="mr-2 text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Tailwind Grid Generator</h1>
        </header>

        <div className="text-center mb-4 text-yellow-400 italic">
          built with ⚡ by Claude AI
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Grid header - column numbers */}
            <div className="flex mb-2">
              <div className="w-8"></div>
              {Array(columns)
                .fill()
                .map((_, colIndex) => (
                  <div
                    key={`col-${colIndex}`}
                    className="flex-1 text-center text-sm"
                  >
                    <div className="bg-gray-800 rounded px-1 py-0.5 inline-block">
                      1fr
                    </div>
                  </div>
                ))}
            </div>

            {/* Grid with row numbers */}
            <div
              className="relative border border-green-400 rounded overflow-hidden"
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
            >
              <div className="flex">
                {/* Row numbers */}
                <div className="flex flex-col">
                  {Array(rows)
                    .fill()
                    .map((_, rowIndex) => (
                      <div
                        key={`row-${rowIndex}`}
                        className="h-16 w-8 flex items-center justify-center text-sm"
                      >
                        <div className="bg-gray-800 rounded px-1 py-0.5">
                          1fr
                        </div>
                      </div>
                    ))}
                </div>

                {/* Grid cells */}
                <div
                  className="flex-1 grid"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 64px)`,
                    columnGap: `${columnGap}px`,
                    rowGap: `${rowGap}px`,
                  }}
                >
                  {Array(rows)
                    .fill()
                    .map((_, rowIndex) =>
                      Array(columns)
                        .fill()
                        .map((_, colIndex) => {
                          const areaId = getAreaIdAtCell(rowIndex, colIndex);

                          // Only render area name on the top-left cell of each area
                          const shouldShowAreaName =
                            areaId &&
                            areas.find(
                              (a) =>
                                a.id === areaId &&
                                a.startRow === rowIndex &&
                                a.startCol === colIndex
                            );

                          return (
                            <div
                              key={`cell-${rowIndex}-${colIndex}`}
                              style={getCellStyle(rowIndex, colIndex)}
                              className="relative"
                              onMouseDown={() =>
                                handleMouseDown(rowIndex, colIndex)
                              }
                              onMouseEnter={() =>
                                handleMouseEnter(rowIndex, colIndex)
                              }
                            >
                              {shouldShowAreaName && (
                                <div className="absolute top-0 left-0 p-1 font-mono text-sm flex items-center">
                                  <span className="mr-1">
                                    .{areas.find((a) => a.id === areaId).name}
                                  </span>
                                  <button
                                    className="text-white opacity-70 hover:opacity-100 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeSelectedArea();
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                    )}
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="mb-4">
                <label className="block mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={columns}
                  onChange={(e) =>
                    setColumns(
                      Math.min(12, Math.max(1, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={rows}
                  onChange={(e) =>
                    setRows(
                      Math.min(12, Math.max(1, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Column Gap (in px)</label>
                <input
                  type="number"
                  min="0"
                  value={columnGap}
                  onChange={(e) =>
                    setColumnGap(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Row Gap (in px)</label>
                <input
                  type="number"
                  min="0"
                  value={rowGap}
                  onChange={(e) =>
                    setRowGap(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isResponsive"
                    checked={isResponsive}
                    onChange={(e) => setIsResponsive(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isResponsive">Responsive Layout</label>
                </div>

                {isResponsive && (
                  <div className="pl-6 space-y-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bpSm"
                        checked={breakpoints.sm}
                        onChange={(e) =>
                          setBreakpoints({
                            ...breakpoints,
                            sm: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="bpSm">Small (sm)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bpMd"
                        checked={breakpoints.md}
                        onChange={(e) =>
                          setBreakpoints({
                            ...breakpoints,
                            md: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="bpMd">Medium (md)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bpLg"
                        checked={breakpoints.lg}
                        onChange={(e) =>
                          setBreakpoints({
                            ...breakpoints,
                            lg: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="bpLg">Large (lg)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bpXl"
                        checked={breakpoints.xl}
                        onChange={(e) =>
                          setBreakpoints({
                            ...breakpoints,
                            xl: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="bpXl">Extra Large (xl)</label>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                onClick={resetGrid}
              >
                Reset grid
              </button>
            </div>
          </div>
        </div>

        {/* Code output section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Generated Tailwind CSS</h2>
          {generateTailwindCSS() || <CodeBlock
          code={'<!--- Create some grid areas to generate Tailwind CSS --->'}
          language="html"
        />}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default App;
