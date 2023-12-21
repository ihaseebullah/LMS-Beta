const mongoose = require("mongoose");
const {
  Student,
  RemindersModel,
  paymentVerifcationModel,
  adminModel,
  ApplicationModel,
  teacherModel,
  GlobalFeeCounter,
} = require("../module/schema");

async function getCounts(req, res) {
  res.render("admin", {
    admin: await adminModel.findOne({ email: req.session.adminId }),
    adminDetails: req.session.adminDetails,
    applicationsNo: (await ApplicationModel.find({})).length,
    approvedApplicationsNumber: (
      await ApplicationModel.find({ status: "approved" })
    ).length,
    administratorsNumber: (await adminModel.find({})).length,
    studentsNumber: (await Student.find({})).length,
    teacherNumber: (await teacherModel.find({})).length,
    deltedDatabase: await Student.find({ status: "deleted" }).length,
    pendingTransactions: (await paymentVerifcationModel.find({ view: "none" }))
      .length,
    approvedTransactions: (
      await paymentVerifcationModel.find({ paymentStatus: "Approved" })
    ).length,
    declinedTransactions: (
      await paymentVerifcationModel.find({ paymentStatus: "Declined" })
    ).length,
  });
}

//Transactions Approvels

async function reviewsTransaction(req, res) {
  const studentData = await paymentVerifcationModel.findById(req.params.txid);
  const student = await Student.findById(studentData.studentId);
  const reminderUpdate = {
    paymentStatus: req.body.status,
  };
  await RemindersModel.findByIdAndUpdate(studentData.invoiceId, reminderUpdate);
  try {
    if (req.body.status == "Approved") {
      const update = {
        name: req.body.firstName,
        fatherName: req.body.fatherName,
        username: req.body.email,
        studentId: req.body.studentId,
        rollno: req.body.rollno,
        tuitionFee: req.body.tuitionFee,
        hostelFee: req.body.hostelFee,
        transpoartFee: req.body.transpoartFee,
        duePayments: req.body.duePayments,
        totallAmount: req.body.totallAmount,
        paymentStatus: req.body.status,
        paymentDate: req.body.paymentDate,
        txId: req.body.txId,
        invoiceId: req.body.InvoiceId,
        month: req.body.month,
        view: "viewd",
        comments: req.body.comments,
        amountPaid: req.body.totallAmount,
      };
      // Assuming 'paymentVerifcationModel' is your Mongoose model
      await paymentVerifcationModel
        .findOneAndUpdate({ _id: req.params.txid }, update, { new: true })
        .then(async () => {
          let previoustCount = await GlobalFeeCounter.findOne({
            studentId: req.body.studentId,
          });
          const updateFees = {
            count: previoustCount.count - req.body.totallAmount,
          };
          await GlobalFeeCounter.findOneAndUpdate(
            { studentId: req.body.studentId },
            updateFees
          ).then(async () => {
            updateStudentPreviousDues = {
              previoustTotallDues: previoustCount.count - req.body.totallAmount,
            };
            await Student.findByIdAndUpdate(
              req.body.studentId,
              updateStudentPreviousDues
            );
          });
        });
    } else {
      const update = {
        name: req.body.firstName,
        fatherName: req.body.fatherName,
        username: req.body.email,
        studentId: req.body.studentId,
        rollno: req.body.rollno,
        tuitionFee: req.body.tuitionFee,
        hostelFee: req.body.hostelFee,
        transpoartFee: req.body.transpoartFee,
        duePayments: req.body.duePayments,
        totallAmount: req.body.totallAmount,
        paymentStatus: req.body.status,
        paymentDate: req.body.paymentDate,
        txId: req.body.txId,
        invoiceId: req.body.InvoiceId,
        month: req.body.month,
        view: "viewd",
        comments: req.body.comments,
        amountPaid: req.body.totallAmount,
      };
      // Assuming 'paymentVerifcationModel' is your Mongoose model
      await paymentVerifcationModel
        .findOneAndUpdate({ _id: req.params.txid }, update, { new: true })
        .then(async () => {
          let unpaidDues = await RemindersModel.findById(studentData.invoiceId);
          const updateRemainngDues = {
            previoustTotallDues: unpaidDues.totallUnPaidDues,
          };
          console.log(updateRemainngDues);
          await Student.findByIdAndUpdate(
            req.body.studentId,
            updateRemainngDues
          );
        });
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect("/admin/pending/transactions" + req.params.txid);
}
//Databases Controllers

async function about(req, res) {
  const role = req.params.role;
  let model = null;
  if (role == "teacher") {
    model = teacherModel;
  } else if (role == "admin") {
    model = adminModel;
  } else {
    model = Student;
  }
  const data = await model.findOne({ cnic: req.params.id });
  res.render("aboutTheStudent", {
    item: data,
    cssPath: "/css/paymentSlip.css",
  });
}

async function verifyTransaction(req, res) {
  const invoiceId = req.params.invoiceId;
  const targetReminder = await RemindersModel.findOne({ _id: invoiceId });
  const newPaymentVerification = new paymentVerifcationModel({
    paymentVerificationCount: (await paymentVerifcationModel.find({})).length,
    name: targetReminder.name,
    fatherName: targetReminder.fatherName,
    username: targetReminder.username,
    studentId: targetReminder.studentId,
    class: targetReminder.class,
    rollno: targetReminder.rollno,
    message: req.body.message,
    amountPaid: req.body.amountPaid,
    paymentStatus: req.body.status,
    paymentMethod: req.body.paymentMethod,
    paymentDate: req.body.date_of_payment_date,
    txId: req.body.transcationId,
    paymentReciept: req.file,
    invoiceId: invoiceId,
  });
  newPaymentVerification.save();
}

module.exports = { getCounts, reviewsTransaction, about, verifyTransaction };
