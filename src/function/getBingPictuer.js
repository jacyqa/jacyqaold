export default async function getBingPictuer() {
  const response = await fetch(
    "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN",
  );
  return await response.json();
}
