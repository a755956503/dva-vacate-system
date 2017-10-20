import axios from 'axios';

async function post(url, user) {
  // let data;
  try {
    const res = await axios.post(url, {
      ...user,
    });
    return res.data;
  } catch (e) {
    return {
      status: 0,
      info: '其他错误',
    };
  }
  // return null;
}
export default {
  post,
};
