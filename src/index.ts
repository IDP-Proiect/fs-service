import express, { Express, Request, Response } from "express";
import fileUpload, { UploadedFile, FileArray } from "express-fileupload";
import { minioClient } from "./utils";
import { config } from "./startup";

const app: Express = express();
const port = config.PORT;

function isSingleFile(
  file: UploadedFile | UploadedFile[]
): file is UploadedFile {
  return typeof file === "object" && (file as UploadedFile).name !== undefined;
}

app.post("/api/insertImage", fileUpload(), async (req, res) => {
  try {
    if (req.files && req.files.file && isSingleFile(req.files.file)) {
      const file: UploadedFile = req.files.file;
      minioClient.putObject(
        process.env.MINIO_BUCKET_NAME as string,
        file.name,
        file.data,
        async function (err, etag) {
          if (err) return console.log(etag);
          console.log("File uploaded successfully.");
          const resultImage = await minioClient.presignedGetObject(
            process.env.MINIO_BUCKET_NAME as string,
            file.name
          );

          return res.json({
            success: true,
            data: "resultImage",
          });
        }
      );
    }
  } catch (error) {
    console.error("Error while inserting image:", error);
    return res.json({
      success: false,
      message: "Error while inserting image.",
    });
  }
});

app.get("/api/getImage/:imageName", async (req: Request, res: Response) => {
  try {
    const { imageName } = req.params;
    const resultImage = await minioClient.presignedGetObject(
      process.env.MINIO_BUCKET_NAME as string,
      imageName
    );

    return res.json({
      success: true,
      data: resultImage,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
