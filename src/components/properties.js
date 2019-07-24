import React from 'react';

// Display an object as definition list

const Properties = ({object, recursive = true, exclude = []}) => {
  if (!object) return null;

  let collector = [];
  
  // format property by typeof
  const formatValue = value => {
    switch (typeof value) {
      case "boolean":
        return value ? "true" : "false";
      case "object":
        return (recursive) ?
          <Properties object={value} /> :
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
          collector.push(<dt key={key}>{key}</dt>);
          collector.push(
            <dd key={`${key}-${object[key]}`}>{formatValue(object[key])}</dd>
          );
        }
      }
    );
  
  return (
    <dl>
      {collector}
    </dl>
  );
}

export default Properties;