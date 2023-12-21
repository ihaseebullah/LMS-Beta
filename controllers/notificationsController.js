const Notification = require("../module/schema").Notifications;
const {
  Student,
  RemindersModel,
  GlobalFeeCounter,
} = require("../module/schema");

async function sendNotifications(req, res) {
  if (req.body.class === "all") {
    try {
      for (let i = 1; i <= 12; i++) {
        const newNotification = new Notification({
          notificationCount: (await Notification.find({})).length,
          class: i,
          message: req.body.message,
        });
        newNotification.save();
      }
      res.send("notification sent to all students");
    } catch (err) {
      console.log(err);
    }
  } else {
    const newNotification = new Notification({
      notificationCount: (await Notification.find({})).length,

      class: req.body.class,
      message: req.body.message,
    });
    newNotification.save().then(() => {
      res.send("notification sent to class " + req.body.class + " students");
    });
  }
}

async function sendReminder(req, res) {
  const allStudents = await Student.find({ class: req.body.class });
  //   const globalFeeCounter = await GlobalFeeCounter.find({});
  //   if (globalFeeCounter.length < allStudents.length) {
  //     for (const students of allStudents) {
  //       const feeCounts = new GlobalFeeCounter({
  //         studentId: students.id,
  //         count: students.previoustTotallDues,
  //       });
  //       await feeCounts.save();
  //     }
  //   }
  if (allStudents.length === 0) {
    return res.redirect(
      "/admin/sendreminder?error=No students found for class : " +
        req.body.class
    );
  }

  for (const student of allStudents) {
    var totall =
      parseInt(req.body.tutionFee) +
      parseInt(req.body.hostelFee) +
      parseInt(req.body.transportFee) +
      parseInt(req.body.tax);
    let previoustTotallDues = 0;
    if (!student.previoustTotallDues) {
      previoustTotallDues = totall;
    } else {
      previoustTotallDues = parseInt(student.previoustTotallDues) + totall;
    }
    const newReminder = new RemindersModel({
      remindersCount: (await RemindersModel.find({})).length,
      name: student.fname,
      fatherName: student.fatherName,
      username: student.username,
      studentId: student.id,
      class: req.body.class,
      rollno: student.rollno,
      message: req.body.message,
      issueDate: req.body.issueDate,
      dueDate: req.body.dueDate,
      paymentStatus: "unpaid",
      month: req.body.month,
      tutionFee: req.body.tutionFee,
      hostelFee: req.body.hostelFee,
      transportFee: req.body.transportFee,
      tax: req.body.tax,
      totall: req.body.totall,
      previoustTotallDues: student.previoustTotallDues,
      totallUnPaidDues: totall,
    });
    console.log(newReminder);
    newReminder.save().then(async () => {
      let previoustCount = await GlobalFeeCounter.findOne({
        studentId: student.id,
      });
      const update = {
        count: previoustCount.count + totall,
      };
      await GlobalFeeCounter.findOneAndUpdate(
        { studentId: student.id },
        update
      ).then(async () => {
        updateStudentPreviousDues = {
          previoustTotallDues: previoustCount.count + totall,
        };
        await Student.findOneAndUpdate(
          { _id: student.id },
          updateStudentPreviousDues
        );
      });
    });
  }

  res.redirect(
    "/admin/sendreminder?error=Reminders sent to Class : " + req.body.class
  );
}

module.exports = { sendNotifications, sendReminder };
