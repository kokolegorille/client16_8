import React from 'react';

// const PlayerInfo = ({player}) => {
//   const {
//     uuid,
//     name, model, colour,
//     action,
//     x, y, z, h, pb
//   } = player;
//   return (
//     <dl className='row'>
//       <dt className='col-sm-3'>UUID</dt>
//       <dd className='col-sm-9'>{uuid}</dd>
//       <dt className='col-sm-3'>Name</dt>
//       <dd className='col-sm-9'>{name}</dd>
//       <dt className='col-sm-3'>Model</dt>
//       <dd className='col-sm-9'>{model}</dd>
//       <dt className='col-sm-3'>Colour</dt>
//       <dd className='col-sm-9'>{colour}</dd>
//       <dt className='col-sm-3'>Animation</dt>
//       <dd className='col-sm-9'>{action}</dd>
//       <dt className='col-sm-3'>Coordinates</dt>
//       <dd className='col-sm-9'>x: {x} y: {y} z: {z}</dd>
//       <dt className='col-sm-3'>Rotations</dt>
//       <dd className='col-sm-9'>h: {h} pb: {pb}</dd>
//     </dl>
//   )
// };

const PlayerInfo = ({player}) => {
  const {
    uuid,
    name, 
    action,
    // model, colour,
    x, y, z, h, pb
  } = player;
  return (
    <dl className='row'>
      <dt className='col-sm-3'>UUID</dt>
      <dd className='col-sm-9'>{uuid}</dd>
      <dt className='col-sm-3'>Name</dt>
      <dd className='col-sm-9'>{name}</dd>
      <dt className='col-sm-3'>Animation</dt>
      <dd className='col-sm-9'>{action}</dd>
      <dt className='col-sm-3'>Coordinates</dt>
      <dd className='col-sm-9'>x: {x} y: {y} z: {z}</dd>
      <dt className='col-sm-3'>Rotations</dt>
      <dd className='col-sm-9'>h: {h} pb: {pb}</dd>
    </dl>
  )
};

export default PlayerInfo;
