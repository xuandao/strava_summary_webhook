export default function handler(req, res) {
    // 你的 JSON 数据
    const jsonData = {
      key: "value",
      items: [1, 2, 3]
    };
  
    // 设置状态码为 200 OK，并发送 JSON 响应
    res.status(200).json(jsonData);
 }