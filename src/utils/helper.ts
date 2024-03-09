import { v4 as uuidV4 } from "uuid";
import fs from "fs";
import path from "path";

export const imageValidator = (size: number, mime: string) => {
  if (bytesToMb(size) > 2) {
    return "Image size must be less than 2 MB";
  } else if (!supportedMimes.includes(mime)) {
    return "Image must be either of type png, jpg, jpeg, webp & gif.";
  }

  return null;
};

export const bytesToMb = (bytes: number) => {
  return bytes / (1024 * 1024);
};

export const generateRandomNum = () => {
  return uuidV4();
};

export const getImageUrl = (imgName: string) => {
  return `${process.env.APP_URL}/images/${imgName}`;
};

export const removeImage = (url: string) => {
  const directoryPath = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  const imgPath = path.join(directoryPath,url.split('/')?.pop() ?? "") 
 
  console.log("IMAGE PATH",imgPath)

  if (fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
  }
};

export const uploadImage = (image: any) => {
  const imgExt = image.name.split(".");
  const imageName = generateRandomNum() + "." + imgExt[1];
  const directoryPath = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  const uploadPath = process.cwd() + "/public/images/" + imageName;

  image.mv(uploadPath, (err: any) => {
    if (err) throw err;
  });

  return imageName;
};

export const supportedMimes = ["image/png", "image/jpg", "image/jpeg", "image/svg", "image/gif", "image/webp"];
