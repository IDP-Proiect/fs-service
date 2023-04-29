import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_URL: process.env.MINIO_URL,
  MINIO_ROOT_USER: process.env.MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD: process.env.MINIO_ROOT_PASSWORD,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
};
