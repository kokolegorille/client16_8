import React from 'react';

// Display an object as tree list

const TreeProperties = ({object, recursive = true, exclude = []}) => {
  if (!object) return null;
  if (typeof object === "string") return <p>{object}</p>;
  
  let collector = [];
  
  // format property by typeof
  const formatValue = value => {
    switch (typeof value) {
      case "boolean":
        return value ? "true" : "false";
      case "object":
        return (recursive) ?
          <TreeProperties object={value} /> :
          JSON.stringify(value);
      default:
        return value;
    }
  }
  
  // Push dt, dd into an array before render
  // to aggregate components witouht a main root
  Object.keys(object)
    .forEach(
      (key) => {
        if (!exclude.includes(key)) {
          collector.push(
            <li key={key}>
              {key}&nbsp;:&nbsp;
              {formatValue(object[key])}
            </li>);
        }
      }
    );
  
  return (
    <ul>
      {collector}
    </ul>
  );
}

export default TreeProperties;