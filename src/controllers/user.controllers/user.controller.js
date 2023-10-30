const UserService = require("../../services/user.services/user.services");
const { userValidation } = require("../../validations");
const { success, error } = require("../../lib-handler");

const {
  Transaction,
  jwt,
} = require("../../utils");

const registerUser = async (req, res,next) => {
   const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();
    const { email, password } =
      await userValidation.userValidation.validateAsync(req.body);
    const user = await UserService.signup(email, password);
    if (!user) {
      throw error.throwPreconditionFailed({
        message: "Server Issue! failed to register a user",
      });
    }
  
    const token = await jwt.createToken(user._id);
  
    await transaction.commitTransaction();
    return success.handler({ user, token }, req, res, next);
  } catch (err) {
    await transaction.abortTransaction();
    return error.handler(err, req, res, next);
   
  } finally {
    await transaction.endSession();
  }
  
};

const userLogin = async (req, res,next) => {
  const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();
    const { email, password } =
      await userValidation.userLoginValidation.validateAsync(req.body);
       
    const user = await UserService.login({ email, password });
  

    const token = await jwt.createToken(user._id);

    await transaction.commitTransaction();
    return success.handler({ user, token }, req, res, next);
   
   
  } catch (error) {
     await transaction.abortTransaction();
     return error.handler(error, req, res, next);
  } finally {
    await transaction.endSession();
  }
   
};

module.exports = {
  registerUser,
  userLogin,
};
