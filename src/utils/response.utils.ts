import { Response } from 'express';

export const sendResponse = (
  res: Response,
  code: number,
  message?: string,
  data: any = {}
) => {
  res.status(code).json({
    success: isCodeSuccessful(code),
    message,
    result: data,
  });
};

const isCodeSuccessful = (code: number) => code >= 200 && code < 300;
