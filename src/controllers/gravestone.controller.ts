import { Request, Response } from "express";
import mongoose, { ClientSession } from "mongoose";
import { sendResponse } from "../utils/response.utils";
import { RequestError } from "../utils/globalErrorHandler";
import { getGravestonesByName } from "../services/gravestone.services";


export const get = async (req: Request, res: Response) => {
    const { gravestoneName } = req.params;
    if (!gravestoneName) throw new RequestError("gravestoneName is required", 400);
  
    const gravestones = await getGravestonesByName(gravestoneName);
    if (!gravestones) throw new RequestError("User does not exist", 404);
    return sendResponse(res, 200, "", gravestones);
  };