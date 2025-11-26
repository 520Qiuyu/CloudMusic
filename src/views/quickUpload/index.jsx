import { useVisible } from '@/hooks/useVisible';
import { msgError } from '@/utils/modal';
import { Modal, Tabs } from 'antd';
import { forwardRef, useState } from 'react';
import SingerChoose from './components/SingerChoose';
import UploadList from './components/UploadList';
import styles from './index.module.scss';

const { TabPane } = Tabs;

function QuickUpload(props, ref) {
  const { visible, open, close } = useVisible(
    {
      onOpen() {},
      onReset() {
        setCurrentTab('1');
      },
    },
    ref,
  );

  // 当前tab
  const [currentTab, setCurrentTab] = useState('1');
  const handleTabChange = (key) => {
    if (key !== '1' && !chooseList.length) {
      return msgError('请选择歌手');
    }
    setCurrentTab(key);
  };

  // 已选择列表
  const [chooseList, setChooseList] = useState([]);
  const handleChoose = (value) => {
    console.log(value);
    setChooseList(value);
    setCurrentTab('2');
  };

  return (
    <Modal
      title='云盘快速上传'
      width={1000}
      centered
      open={visible}
      footer={null}
      destroyOnHidden
      onCancel={close}>
      <Tabs
        defaultActiveKey='1'
        activeKey={currentTab}
        className={styles['quick-upload-tabs']}
        onChange={handleTabChange}>
        {/* 歌手选择 */}
        <TabPane tab='歌曲选择' key='1'>
          <SingerChoose
            defaultSingerList={chooseList}
            onChoose={handleChoose}
          />
        </TabPane>
        {/* 上传列表 */}
        <TabPane tab='上传列表' key='2'>
          <UploadList singerList={chooseList} />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default forwardRef(QuickUpload);
