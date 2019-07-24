import React, { useEffect } from 'react';

import TreeProperties from './components/tree_properties';

const Member = ({authentication}) => {
  useEffect(() => {
    console.log('Mount');
    
    return () => {
      console.log('Unmount');
    }
  }, []);

  return (
    <div>
      <h2>Member</h2>
      <TreeProperties object={authentication} />
    </div>
  )
};

export default Member;