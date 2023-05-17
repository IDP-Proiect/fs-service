import express, { Express, Request, Response } from "express";
import fileUpload, { UploadedFile, FileArray } from "express-fileupload";
import { minioClient } from "./utils";
import { config } from "./startup";

const app: Express = express();
const port = 80;

function isSingleFile(
  file: UploadedFile | UploadedFile[]
): file is UploadedFile {
  return typeof file === "object" && (file as UploadedFile).name !== undefined;
}

// Insert a single image in the bucket
// Handles response return as well
function InsertImageInBucket(file: UploadedFile, res: Response) {
  minioClient.putObject(
    process.env.MINIO_BUCKET_NAME as string,
    file.name,
    file.data,
    async function (err, etag) {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Error while inserting image.",
        });

      const resultImage = await minioClient.presignedGetObject(
        process.env.MINIO_BUCKET_NAME as string,
        file.name
      );

      return res.json({
        success: true,
        data: resultImage,
      });
    }
  );
}

app.post("/api/insertImage", fileUpload(), async (req, res) => {
  try {
    if (req.files && req.files.file && isSingleFile(req.files.file)) {
      const file: UploadedFile = req.files.file;

      // Extract image bucket name
      const bucket_name = process.env.MINIO_BUCKET_NAME as string;
      // Check if bucket exists and create it if not
      minioClient.bucketExists(bucket_name, (err, exists) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error while checking for bucket.",
          });
        }
        if (!exists) {
          minioClient.makeBucket(bucket_name, "", function (err) {
            if (err)
              return res.status(500).json({
                success: false,
                message: "Error while creating bucket.",
              });
            else return InsertImageInBucket(file, res);
          });
        } else {
          return InsertImageInBucket(file, res);
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
  } catch (error) {
    console.error("Error before attempting to insert image:", error);
    return res.json({
      success: false,
      message: "Error before attempting to insert image",
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
