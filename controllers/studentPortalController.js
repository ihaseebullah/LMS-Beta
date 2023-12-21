const NodeCache = require("node-cache");
const {
  RemindersModel,
  paymentVerifcationModel,
  Student,
  quizModel,
  quizResultModel,
  Notifications,
} = require("../module/schema");
const myCache = new NodeCache();

async function viewSlip(req, res) {
  const id = req.params.id;
  const reminder = await RemindersModel.findById(id);
  const transaction = await paymentVerifcationModel.findOne({ invoiceId: id });
  let paymentStatus = "Unpaid";
  let transactionAlreadyPresent;
  if (transaction) {
    paymentStatus = transaction.paymentStatus;
    transactionAlreadyPresent = true;
  } else {
    transactionAlreadyPresent = false;
  }
  return {
    reminder: reminder,
    paymentStatus: paymentStatus,
    transaction: transaction,
    transactionAlreadyPresent: transactionAlreadyPresent,
  };
}

async function loadTarget(req, res) {
  const data = await Student.findOne({ username: req.user.username });
  const date = new Date();
  const reminders = await RemindersModel.find({
    username: req.user.username,
  }).sort({ remindersCount: -1 });
  const notifyMe = await Notifications.find({ class: req.user.class }).sort({
    notificationCount: -1,
  });
  const quizes = await quizModel
    .find({ class: req.user.class })
    .sort({ quizNumberCount: -1 });
  const quizResult = await quizResultModel
    .find({ studentId: req.user.cnic })
    .sort({ totallQuizes: -1 })
    .limit(4);
  const transactions = await paymentVerifcationModel
    .find({ studentId: req.user.id })
    .sort({ paymentVerificationCount: -1 })
    .limit(4);
  console.log(transactions);
  res.render("studentsPortal/dashboard", {
    transactions: transactions,
    quizResult: quizResult,
    data: req.user,
    notifyMe: notifyMe,
    reminders: reminders,
    quizes: quizes,
  });
}

module.exports = { viewSlip, loadTarget };
