import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const config = {
    PORT: process.env.PORT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_URL: process.env.MINIO_URL,
    MINIO_ROOT_USER: process.env.MINIO_ROOT_USER,
    MINIO_ROOT_PASSWORD: fs.readFileSync('/run/secrets/MINIO_ROOT_PASSWORD', 'utf8').trim(),
    MINIO_ACCESS_KEY: fs.readFileSync('/run/secrets/MINIO_ACCESS_KEY', 'utf8').trim(),
    MINIO_SECRET_KEY: fs.readFileSync('/run/secrets/MINIO_SECRET_KEY', 'utf8').trim(),
    MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
};
