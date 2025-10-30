import { useEffect } from 'react';
import ButtonGroup from './components/ButtonGroup';
import { getUserAccount } from './api';

function App() {
  /** 获取用户信息 */
  const getUserInfo = async () => {
    try {
      const res = await getUserAccount();
      console.log('res', res);
      if (res.code === 200) {
        window.CustomUser = {
          ...res.account,
          ...res.profile,
        };
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className='App'>
      <ButtonGroup />
    </div>
  );
}

export default App;
