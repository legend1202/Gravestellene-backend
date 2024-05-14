import { Request, Response } from 'express';
import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.files) {
    throw new RequestError('files is required', 400);
  }

  const imageFiles = req.files as Express.Multer.File[];

  if (!imageFiles.length)
    throw new RequestError('Please upload your local images', 400);

  var fileName: string[] = [];

  if (imageFiles && imageFiles.length) {
    imageFiles.map((file: any) => fileName.push(file.path));
  }

  return sendResponse(res, 200, 'Uploaded images', { image_urls: fileName });
};
