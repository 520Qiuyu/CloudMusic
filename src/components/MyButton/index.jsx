import { Button } from 'antd';
import { useEffect, useState } from 'react';

export default function MyButton(props) {
  const { loading, onClick, ...rest } = props;

  const [_loading, setLoading] = useState(loading);
  const handleClick = async (...args) => {
    try {
      setLoading(true);
      await onClick?.(...args);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return <Button {...rest} onClick={handleClick} loading={_loading} />;
}
