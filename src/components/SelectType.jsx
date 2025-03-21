import React from "react";

const SelectType = ({ type, setType }) => {
  const changeEvent = (e) => {
    const type = e.target.value;
    setType(type);
  };

  return (
    <div className="flex items-center justify-start gap-3">
      <span>Select Type: </span>
      <label htmlFor="html">
        <input
          onChange={changeEvent}
          type="radio"
          name="type"
          id="html"
          value="HTML"
          checked={type === "HTML"}
        />
        &nbsp; HTML
      </label>
      <label htmlFor="jsx">
        <input
          onChange={changeEvent}
          type="radio"
          name="type"
          id="jsx"
          value="JSX"
          checked={type === "JSX"}
        />
        &nbsp; JSX
      </label>
    </div>
  );
};

export default SelectType;
