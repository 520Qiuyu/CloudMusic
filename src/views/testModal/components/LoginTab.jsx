import { getQrCode, getQrKey, getQrStatus, getUserAccount } from '@/api/login';
import { MyButton } from '@/components';
import { sleep } from '@/utils';
import copy from '@/utils/copy';
import { msgError, msgSuccess } from '@/utils/modal';
import { Input } from 'antd';
import { Space } from 'antd';
import { Form } from 'antd';

/**
 * 登录相关测试组件
 */
const LoginTab = () => {
  // 获取用户信息
  const handleGetUserAccount = async () => {
    console.log('获取用户信息');
    try {
      const res = await getUserAccount();
      console.log('res', res);
      if (res.code !== 200) return msgError('获取用户信息失败');
      msgSuccess('获取用户信息成功,请打开控制台查看！');
    } catch (error) {
      console.log('error', error);
    }
  };

  // qr登录
  const handleQrLogin = async () => {
    console.log('二维码登录');
    try {
      const keyRes = await getQrKey();
      if (keyRes.code !== 200) return msgError('获取二维码key失败');
      const key = keyRes.unikey;
      console.log('获取key成功：', key);
      const qrcode = await getQrCode(key);

      // 显示二维码
      displayQrCode(qrcode);

      // 检查二维码状态 2分钟
      const timeOutTime = Date.now() + 2 * 60 * 1000;
      while (Date.now() < timeOutTime) {
        const qrStatusRes = await getQrStatus(key);
        console.log('qrStatus', qrStatusRes);
        // 801:等待扫码 802:授权中 803:授权成功 800:不存在或失效
        const { code } = qrStatusRes;
        if (code === 801) {
          console.log('等待扫码');
        } else if (code === 802) {
          console.log('授权中');
        } else if (code === 803) {
          console.log('授权成功');
          console.log('qrStatusRes', qrStatusRes);
          break;
        } else if (code === 800) {
          console.log('不存在或失效');
          break;
        }
        await sleep(1000);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleCopyUserCookie = async () => {
    try {
      await copy(document.cookie);
      msgSuccess('复制成功');
    } catch (error) {
      console.log('error', error);
      msgError('复制失败');
    }
  };
  return (
    <Form>
      {/* 测试获取用户信息 */}
      <Form.Item label='获取用户信息'>
        <MyButton type='primary' onClick={handleGetUserAccount}>
          获取用户信息
        </MyButton>
      </Form.Item>

      {/* 测试二维码登录 */}
      <Form.Item label='二维码登录'>
        <Space>
          <MyButton type='primary' onClick={handleQrLogin}>
            二维码登录
          </MyButton>
          <div id='qrcode-container'></div>
        </Space>
      </Form.Item>

      {/* 测试用户cookie */}
      <Form.Item label='测试用户cookie'>
        <Space.Compact style={{ width: '100%' }}>
          <Input.TextArea
            autoSize={{ minRows: 10, maxRows: 20 }}
            readOnly
            value={document.cookie}
          />
          <MyButton type='primary' onClick={handleCopyUserCookie}>
            复制
          </MyButton>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default LoginTab;

const displayQrCode = (qrcode) => {
  const qrImg = document.createElement('img');
  qrImg.src = qrcode;
  qrImg.style.width = '200px';
  qrImg.style.height = '200px';
  document.getElementById('qrcode-container').innerHTML = '';
  document.getElementById('qrcode-container').appendChild(qrImg);
};
