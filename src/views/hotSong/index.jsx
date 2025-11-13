import { useGetSingerInfo, useVisible } from '@/hooks';
import { Modal } from 'antd';
import { forwardRef } from 'react';

/**
 * 热门歌曲弹窗组件
 * @description 用于显示歌手的热门歌曲列表
 */
const HotSongModal = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible(
    {
      onOpen: (params) => {
        params && setParams(params);
      },
      onReset: () => {
        setParams({});
      },
    },
    ref,
  );

  const [params, setParams] = useState();
  const { singerInfo, singerAlbum, singerAllSong } = useGetSingerInfo(params.singerId);

  return (
    <Modal
      title='热门歌曲'
      open={visible}
      onCancel={close}
      width={1200}
      centered
      footer={null}>
      {/* 热门歌曲内容 */}
      <div>热门歌曲内容</div>
    </Modal>
  );
});

export default HotSongModal;
