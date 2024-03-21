import mongoose from "mongoose";
mongoose.set("strictQuery", true);

export const connectionDB = async () => {
  mongoose
    .connect(process.env.DB_ONLINE  )
    .then(() => {
      console.log("database Connected");
    })
    .catch((err) => {
      console.log("database Error: ", err);
    });
};

export default connectionDB;
