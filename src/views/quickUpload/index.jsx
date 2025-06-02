import { useVisible } from '@/hooks/useVisible';
import { msgError } from '@/utils/modal';
import { Modal, Tabs } from 'antd';
import { forwardRef, useState } from 'react';
import { getArtists, getArtists2 } from '../../api';
import SingerChoose from './components/SingerChoose';
import UploadList from './components/UploadList';
import styles from './index.module.scss';

const { TabPane } = Tabs;

function QuickUpload(props, ref) {
  const { visible, open, close } = useVisible(
    {
      onOpen() {
        getSingerList();
      },
      onReset() {
        setSingerList([]);
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

  // 歌手列表
  const [singerList, setSingerList] = useState([]);
  const [loading, setLoading] = useState(false);
  // 获取歌手
  const getSingerList = async () => {
    try {
      setLoading(true);
      const res = await getArtists();
      const res2 = await getArtists2();
      console.log('res2', res2);
      // 合并两个数组并按照id去重
      const list = [
        ...new Map([...res2, ...res].map((item) => [item.id, item])).values(),
      ];
      console.log('list', list);
      setSingerList(list);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
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
      width={900}
      centered
      open={visible}
      footer={null}
      onCancel={close}
    >
      <Tabs
        defaultActiveKey='1'
        activeKey={currentTab}
        className={styles['quick-upload-tabs']}
        onChange={handleTabChange}
      >
        {/* 歌手选择 */}
        <TabPane tab='歌曲选择' key='1'>
          <SingerChoose
            singerList={singerList}
            loading={loading}
            onChoose={handleChoose}
          />
        </TabPane>
        {/* 上传列表 */}
        <TabPane tab='上传列表' key='2'>
          <UploadList key={currentTab} singerList={chooseList} />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default forwardRef(QuickUpload);
