import { Avatar, Card, Tag, Typography } from 'antd';
import styles from './index.module.scss';

/**
 * 用户评论展示组件
 * @param {Object} props - 组件属性
 * @param {Array} props.comments - 评论列表
 * @example
 * <UserComments comments={userComments} />
 */
export default function UserComments(props) {
  const { comments = [
    {
        "commentId": 5928599,
        "content": "副歌的惊艳程度如何？我把它写进我高三的一次作文里 然后老师把这一句抄在了黑板上。",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 1764,
        "likedCount": 145327,
        "liked": false,
        "time": 1416224312409,
        "threadId": "R_SO_4_167870",
        "timeStr": "2014-11-17",
        "user": {
            "userId": 5807720,
            "nickname": "一只瓶子__",
            "avatarUrl": "http://p4.music.126.net/GWZVwk-_4B6xX0sOHaMEEA==/2539871861864255.jpg",
            "vipType": 11,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 48731267,
        "content": "09年听这首歌，当时我们在网恋，15年又在听这首歌，不过我们中间躺着个可爱又磨人的小丫头[爱心]",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 1902,
        "likedCount": 78921,
        "liked": false,
        "time": 1448261951460,
        "threadId": "R_SO_4_167870",
        "timeStr": "2015-11-23",
        "user": {
            "userId": 72139956,
            "nickname": "时光淡人心",
            "avatarUrl": "http://p3.music.126.net/rlVEyAsTnFhc_kHqnWx01w==/109951164918562028.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 4147239,
        "content": "红雨瓢泼泛起了回忆怎么潜，你美目如当年，流转我心间，渡口边最后一面洒下了句点，与你若只如初见，何须感伤离别。",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 443,
        "likedCount": 74946,
        "liked": false,
        "time": 1409885138914,
        "threadId": "R_SO_4_167870",
        "timeStr": "2014-09-05",
        "user": {
            "userId": 17447222,
            "nickname": "Independencer",
            "avatarUrl": "http://p3.music.126.net/y-zDnmGUx1FrNYFQ1VVaQw==/2899412162481433.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 222162961,
        "content": "估计很多人都是   突然想听许嵩  。",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 907,
        "likedCount": 49511,
        "liked": false,
        "time": 1475217987121,
        "threadId": "R_SO_4_167870",
        "timeStr": "2016-09-30",
        "user": {
            "userId": 115493405,
            "nickname": "南音喏",
            "avatarUrl": "http://p4.music.126.net/hIIpxAYlHD96mjd0EP4Tow==/109951166869692591.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 5522914,
        "content": "突然想听许嵩，于是坐着一首首的听。许嵩于我而言，是一种怀旧，那时的人、那时的事，现在想起依然历历在目，虽然不是回忆的全部，但却也构成了我的大部分生活。现在的我早已不习惯怀旧，因为我选择忘的太快。或许，对某些人而言，只是记忆罢了。也不知道今晚自己唧唧歪歪都说了些什么",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 249,
        "likedCount": 41340,
        "liked": false,
        "time": 1415280737301,
        "threadId": "R_SO_4_167870",
        "timeStr": "2014-11-06",
        "user": {
            "userId": 16137105,
            "nickname": "Koala_小呆",
            "avatarUrl": "http://p3.music.126.net/WdKvTvF8R_WD2bIiq89wkw==/1379887099241878.jpg",
            "vipType": 11,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 48323347,
        "content": "真的  许嵩的歌词  挽救了我多少作文",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 230,
        "likedCount": 30901,
        "liked": false,
        "time": 1448095822477,
        "threadId": "R_SO_4_167870",
        "timeStr": "2015-11-21",
        "user": {
            "userId": 55121576,
            "nickname": "看什么不如听什么",
            "avatarUrl": "http://p3.music.126.net/Mdm8X2drMAQVGNxu799bag==/3315027559529810.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 157029791,
        "content": "我会说我这昵称用了7年？",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 5906,
        "likedCount": 29710,
        "liked": false,
        "time": 1463670933624,
        "threadId": "R_SO_4_167870",
        "timeStr": "2016-05-19",
        "user": {
            "userId": 248301558,
            "nickname": "泛起回忆怎么潜",
            "avatarUrl": "http://p3.music.126.net/3pWlFXDyA54ue5KdxMG66Q==/109951167832171824.jpg",
            "vipType": 11,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 8866955,
        "content": "副歌部分简直不能听，不能忍。一出来就要跪。两相映衬之下，我有多幸运那年听到了许嵩。❤",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 56,
        "likedCount": 22583,
        "liked": false,
        "time": 1421410159436,
        "threadId": "R_SO_4_167870",
        "timeStr": "2015-01-16",
        "user": {
            "userId": 42100526,
            "nickname": "朝流暮坠",
            "avatarUrl": "http://p4.music.126.net/6P5ak-xPtNvKtYHw3rzRvA==/109951172345425350.jpg",
            "vipType": 11,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 6565955,
        "content": "是惊鸿一面不减多年深情的风景还是飘摇山水之间的美丽？是隐隐约约发香好似江水连天还是能写的一手眉清目秀的正楷？这世间女子千万种，我却实在想不出什么样的配你刚刚好。许公子许公子，能不能告诉我们你最喜欢怎样的女子？",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 135,
        "likedCount": 18834,
        "liked": false,
        "time": 1417487886483,
        "threadId": "R_SO_4_167870",
        "timeStr": "2014-12-02",
        "user": {
            "userId": 18195689,
            "nickname": "尘暮雪",
            "avatarUrl": "http://p3.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 6564056,
        "content": "在知乎看到关于许嵩的争论，多是调侃和鄙视，很无奈的感觉。好久不听回来找几首过过耳朵，听着这些歌就仿佛回到了几年前的高中岁月，还是老歌好听。现在有些人就像出生就是30岁一样，谁都看不起，逼格高的很。",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 17,
        "likedCount": 17719,
        "liked": false,
        "time": 1417448097786,
        "threadId": "R_SO_4_167870",
        "timeStr": "2014-12-01",
        "user": {
            "userId": 39492557,
            "nickname": "子不烦",
            "avatarUrl": "http://p4.music.126.net/vvv71jD5ALuyahmnlIBrEw==/109951163468406971.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 46706547,
        "content": "那次英语课，班里的同学都因为下午第一节课昏昏欲睡，老师让我唱首歌给大家提提神[流泪]，结果我唱了这首歌，大家听得很安静，我心里也很紧张，结果唱完后，班里炸开了，我也成了新的文艺班长，这可能是我高中最珍贵的一次记忆了，以至于现在我还忘不了，我心里的她看我的目光，当天晚上我就表白了…",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 287,
        "likedCount": 15018,
        "liked": false,
        "time": 1447452468760,
        "threadId": "R_SO_4_167870",
        "timeStr": "2015-11-14",
        "user": {
            "userId": 64408049,
            "nickname": "那一座孤城",
            "avatarUrl": "http://p4.music.126.net/AUjqVyWCqvEhE0QWZtZelQ==/109951162855404900.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 1332513078,
        "content": "老哥这不对啊，我也写了。老师说我语法错误。。。",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 0,
        "likedCount": 11507,
        "liked": false,
        "time": 1545308440134,
        "threadId": "R_SO_4_167870",
        "timeStr": "2018-12-20",
        "user": {
            "userId": 554911338,
            "nickname": "超爱笑的糖QAQ",
            "avatarUrl": "http://p4.music.126.net/zLi24qnrKhy9fFB-R8RdZw==/109951164392062363.jpg",
            "vipType": 11,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 22206064,
        "content": "[憨笑][憨笑]32岁的大叔表示灰常喜欢许嵩的歌",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 1204,
        "likedCount": 9593,
        "liked": false,
        "time": 1434340600517,
        "threadId": "R_SO_4_167870",
        "timeStr": "2015-06-15",
        "user": {
            "userId": 60297721,
            "nickname": "大菠萝O",
            "avatarUrl": "http://p4.music.126.net/_UmEDjs-YFHNvJgzY1rW9A==/7696581395881329.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 1333272186,
        "content": "你就说是王维写的！试试看老师的反应[大哭]",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 0,
        "likedCount": 7865,
        "liked": false,
        "time": 1545371170843,
        "threadId": "R_SO_4_167870",
        "timeStr": "2018-12-21",
        "user": {
            "userId": 279482289,
            "nickname": "思夕颜画",
            "avatarUrl": "http://p4.music.126.net/PMGfjSaYokNPSQPpc-fTMw==/109951164006378222.jpg",
            "vipType": 11,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    },
    {
        "commentId": 5167711,
        "content": "因为这首歌，高三认识了一个女孩，可惜现在都不敢打扰。也因为这首歌，让一个初二的同学又记起了我，不知是喜是悲。与你若只如初见，何须感伤离别。致曾经一起听歌的你们。",
        "ipLocation": {
            "ip": null,
            "location": "",
            "userId": null
        },
        "replyCount": 15,
        "likedCount": 6906,
        "liked": false,
        "time": 1414257971569,
        "threadId": "R_SO_4_167870",
        "timeStr": "2014-10-26",
        "user": {
            "userId": 32718832,
            "nickname": "一面仰望",
            "avatarUrl": "http://p3.music.126.net/fGiAk_cT7KfL3T_qD0OrJQ==/6671836558384256.jpg",
            "vipType": 0,
            "authStatus": 0,
            "followed": false,
            "isHug": false
        }
    }
] } = {};

  if (!comments || comments.length === 0) {
    return null;
  }

  const displayComments = comments.slice(0, 15);

  return (
    <div className={styles['comments-section']}>
      <Card
        title={
          <div className={styles['comments-header']}>
            <span>用户评论</span>
            <Tag color='blue' className={styles['total-tag']}>
              共 {comments.length} 条
            </Tag>
          </div>
        }
        className={styles['comments-card']}>
        <div className={styles['comments-list']}>
          {displayComments.map((comment, index) => (
            <div key={comment.commentId || index} className={styles['comment-item']}>
              <div className={styles['comment-header']}>
                <Avatar
                  src={comment.user?.avatarUrl}
                  size={40}
                  className={styles['comment-avatar']}>
                  {comment.user?.nickname?.[0] || 'U'}
                </Avatar>
                <div className={styles['comment-user-info']}>
                  <div className={styles['comment-user-name']}>
                    {comment.user?.nickname || '未知用户'}
                    {comment.user?.vipType > 0 && (
                      <Tag color='red' size='small' className={styles['vip-tag']}>
                        VIP{comment.user.vipType}
                      </Tag>
                    )}
                  </div>
                  <div className={styles['comment-meta']}>
                    <span>{comment.timeStr || '-'}</span>
                    {comment.ipLocation?.location && (
                      <Tag size='small' className={styles['location-tag']}>
                        📍 {comment.ipLocation.location}
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
              <Typography.Paragraph
                ellipsis={{ rows: 3, expandable: true }}
                className={styles['comment-content']}>
                {comment.content || '-'}
              </Typography.Paragraph>
              <div className={styles['comment-footer']}>
                {comment.likedCount > 0 && (
                  <Tag color='orange' className={styles['liked-tag']}>
                    👍 {comment.likedCount}
                  </Tag>
                )}
                {comment.replyCount > 0 && (
                  <Tag className={styles['reply-tag']}>
                    💬 {comment.replyCount} 条回复
                  </Tag>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

