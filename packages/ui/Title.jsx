import { useEffect } from 'react';

const Title = function ({ children }) {
  useEffect(() => {
    document.title = `${children} | Siaka`;
  }, [children]);

  return null;
};

export default Title;
