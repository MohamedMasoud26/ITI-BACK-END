import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import recentModel from '../../../../DB/model/Recent.model.js'
import { asyncHandler } from '../../../utils/errorHandling.js'
const __dirname = fileURLToPath(import.meta.url);


export const getRecent= asyncHandler(async(req,res,next)=>{
    const recentModels = await recentModel.find()
    return res.status(200).json({message:'done',recentModels,success:true})
})

export const createRecent = asyncHandler( async (req,res,next)=>{
  const recentImage = req.file;
  const userId = req.user
  const fullPath = recentImage.finalDest;
  const newRecent=await recentModel.create(
    {
      imageToUpdate: fullPath,
      image: fullPath,
      createdBy:userId
    })
  res
    .status(200)
    .json({  message: "new recent created successfully!",newRecent,success:true });
})

export const updateRecent = asyncHandler(async (req, res, next) => {
    const recentId = req.params.recentId;
    const recentImage = req.file;
    const userId = req.user

    const recent = await recentModel.findById(recentId);
    if (!recent) {
      return next(new Error("No recent found with this Id!", { cause: 400 }));
    }
    if (recent.image) {
      const oldImagePath = path.join(
        __dirname,'..','..','..','..'
        ,`${recent.imageToUpdate}`
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    const fullPath = recentImage.finalDest;
    const newRecent=await recentModel.findByIdAndUpdate(recent,
      {
        imageToUpdate: fullPath,
        image: fullPath,
        updatedBy:userId
      },{new:true}
    );
    res
      .status(200)
      .json({  message: "recent image updated successfully!", newRecent,success:true });
});

export const deleteRecent = asyncHandler( async (req,res,next)=>{
    const recentId=req.params.recentId
    const recent =await recentModel.findById(recentId)
    if(!recent){
        return next(new Error('recent not found',{code:404}))
    }
    if (recent.image) {
        const oldImagePath = path.join(
          __dirname,'..','..','..','..'
          ,`${recent.imageToUpdate}`
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    await recentModel.findByIdAndDelete(recentId)
    return res.status(200).json({message:`recent deleted successfully` ,success:true} )
}) 
