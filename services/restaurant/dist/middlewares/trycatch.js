const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };
};
export default TryCatch;
// const TryCatch = (handler: RequestHandler): RequestHandler => {
//   return async (req, res, next) => {
//     try {
//       await handler(req, res, next);
//     } catch (error: any) {
//       console.error("================================");
//       console.error(error);
//       console.error("================================");
//       return res.status(500).json({
//         message: error.message,
//       });
//     }
//   };
// };
// export default TryCatch;
