const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: "public_eGO7Us7zj6hf295xIN1rBGFwvKU=",
  privateKey: "private_xvrMdPIdQMD9W4nvOtwceTctHNo=",
  urlEndpoint: "https://ik.imagekit.io/yxxt8q97s",
});

module.exports = imagekit;
