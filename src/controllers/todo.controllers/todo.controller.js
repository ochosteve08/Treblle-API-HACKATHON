const { todoServices } = require("../../services");
const { todoValidation } = require("../../validations");
const { Transaction } = require("../../utils");
const { success, error } = require("../../lib-handler");


const createTodo = async (req, res, next) => {
  const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();
    const { title, description } =
      await todoValidation.addTodoValidation.validateAsync(req.body);
    const user_id = req.user._id;

    const todo = await todoServices.createTodo({
      title,
      description,
      user_id,
    });

    await transaction.commitTransaction();
    return success.handler({ todo }, req, res, next);
  } catch (err) {
    await transaction.abortTransaction();
    return error.handler(err, req, res, next);
  } finally {
    await transaction.endSession();
  }
};


const getTodo = async (req, res, next) => {
  const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();
    const { id } = await todoValidation.todoIdValidation.validateAsync(
      req.params
    );
    const todo = await todoServices.getTodo({ id });
    if (!todo) {
      throw error.throwNotFound({ message: "todo not found" });
    }
    await transaction.commitTransaction();
    return success.handler({ todo }, req, res, next);
  } catch (err) {
    await transaction.abortTransaction();
    return error.handler(err, req, res, next);
  } finally {
    await transaction.endSession();
  }
};


const fetchAllTodo = async (req, res, next) => {
  const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();
    const user_id = req.user._id;
    const todo = await todoServices.fetchAllTodo({ user_id });

    await transaction.commitTransaction();
    return success.handler({ todo }, req, res, next);
  } catch (error) {
    await transaction.abortTransaction();
    return error.handler(error, req, res, next);
  } finally {
    await transaction.endSession();
  }
};


const updateTodo = async (req, res, next) => {
  const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();
    const { title, description, completed } =
      await todoValidation.updateTodoValidation.validateAsync(req.body);
    const { id } = await todoValidation.todoIdValidation.validateAsync(
      req.params
    );
    const updatedTodo = await todoServices.updateTodo({
      title,
      description,
      completed,
      id,
    });
    await transaction.commitTransaction();
    return success.handler({ updatedTodo }, req, res, next);
  } catch (error) {
    await transaction.abortTransaction();
    return error.handler(error, req, res, next);
  } finally {
    await transaction.endSession();
  }
};


const deleteTodo = async (req, res, next) => {
  const transaction = await Transaction.startSession();
  try {
    await transaction.startTransaction();

    const { id } = await todoValidation.todoIdValidation.validateAsync(
      req.params
    );
    const todo = await todoServices.deleteTodo({ id });
    if (!todo) {
      throw error.throwNotFound({ message: "todo not found" });
    }
    await transaction.commitTransaction();
    return success.handler({ todo }, req, res, next);
  } catch (error) {
    await transaction.abortTransaction();
    return error.handler(error, req, res, next);
  } finally {
    await transaction.endSession();
  }
};

module.exports = {
  createTodo,
  fetchAllTodo,
  getTodo,
  deleteTodo,
  updateTodo,
};
