import { config } from "../../startup";
import { Client } from "minio";

export const minioClient = new Client({
  endPoint: config.MINIO_URL as string,
  port: Number.parseInt(config.MINIO_PORT as string),
  useSSL: false,
  accessKey: config.MINIO_ACCESS_KEY as string,
  secretKey: config.MINIO_SECRET_KEY as string,
});
