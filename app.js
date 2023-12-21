// jshint ESversion 6
require("dotenv").config();
const sanitizeHtml = require("sanitize-html");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const convertToEmbedSrc = require("./module/convertLink.js").convertToEmbedSrc;
const bcrypt = require("bcrypt");
const NodeCache = require("node-cache");
const methodOverride = require("method-override");
const { send } = require("process");
const { sign } = require("crypto");
const { request } = require("http");
const passport = require("passport");
const mongooseConnect = require("./module/mongooseConnect.js");
const LocalStrategy = require("passport-local").Strategy;
const Student = require("./module/schema.js").Student;
const ReviewsModel = require("./module/schema.js").ReviewsModel;
const {
  slipModel,
  ApplicationModel,
  Notifications,
} = require("./module/schema.js");
const Notification = require("./module/schema.js").Notifications;
const adminModel = require("./module/schema.js").adminModel;
const paymentVerifcationModel =
  require("./module/schema.js").paymentVerifcationModel;
const quizModel = require("./module/schema.js").quizModel;
const teacherModel = require("./module/schema.js").teacherModel;
const ResultModel = require("./module/schema.js").ResultModel;
const quizResultModel = require("./module/schema.js").quizResultModel;
const lectureModel = require("./module/schema.js").lectureModel;
const Blog = require("./module/schema.js").Blog;
const PostComments = require("./module/schema.js").PostComments;
const RemindersModel = require("./module/schema.js").RemindersModel;

//// Controlers
const blogController = require("./controllers/blogcontroller.js");
const loginController = require("./controllers/loginControllers.js");
const signupController = require("./controllers/signupController.js");
const NotificationController = require("./controllers/notificationsController.js");
const studentPortalController = require("./controllers/studentPortalController.js");
const adminControllers = require("./controllers/adminControllers.js");
const tboardControllers = require("./controllers/tboardControllers.js");
const teacherLogin = require("./controllers/loginControllers.js");

const salt = 10;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
const myCache = new NodeCache();
// Create a function to set up multer middleware
function setupMulter(destination) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
}

// Use the setupMulter function to create multer middleware instances
const upload = multer({ storage: setupMulter("public/uploads/dps") });
const blog = multer({ storage: setupMulter("public/uploads/blog") });
const uploadQuiz = multer({ storage: setupMulter("public/uploads/quiz") });
const uploadSlips = multer({
  storage: setupMulter("public/uploads/paymentSlips"),
});
const tboard_media = multer({ storage: setupMulter("public/uploads/tboard") });
const lecturesUpload = multer({
  storage: setupMulter("public/uploads/tboard/lecture"),
});

// ... Set up other multer instances using the same setupMulter function ...

//Passport
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }, // The login timeout is set to 30 minutes.You can modify it by changing the figure "1" in the cookie maxAge query...
  })
);
app.use(passport.initialize());
app.use(passport.session());
let adminIsAuthorised = false;
let teacherIsAuthorised = false;
let adminId = null;
let adminDetails = null;
let teacherDetails = null;
let teacherId = null;
//pssport setup intialization
app.get("/", async function (req, res) {
  console.log(req.session);
  const blogPosts = await Blog.find({}).limit(3).sort({ postCount: -1 });
  res.render("index", { blogPosts: blogPosts });
});

app.get("/applyOnline", function (req, res) {
  res.render("apply");
});
app.get("/adminLogin", async function (req, res) {
  res.render("adminLogin");
});

app.post("/adminlogin", async (req, res) => {
  try {
    await loginController.adminLogin(req, res);
  } catch (error) {
    console.error(error);
    res.redirect("/adminLogin?error=Internal Server Error");
  }
});

app.get("/admin/pending/applications", async function (req, res) {
  const applications = await ApplicationModel.find({});
  const totallNumberOfApplications = applications.length;
  res.render("pendingApplications", {
    applications: applications,
    no: totallNumberOfApplications,
    admin: req.session.adminDetails,
  });
});

app.get("/adminSignup", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    res.render("adminSignup");
  }
});
app.post(
  "/adminSignUp",
  upload.single("profilePicture"),
  async function (req, res) {
    try {
      await signupController.adminSignUp(req, res);
    } catch (err) {
      if (err.code === 11000) {
        // MongoDB duplicate key error code
        if (err.keyPattern && err.keyPattern.email) {
          res.redirect(
            "/adminSignup?error=" + req.body.email + " is already taken!"
          );
        } else if (err.keyPattern && err.keyPattern.cnic) {
          res.redirect(
            "/adminSignup?error=" + req.body.cnic + " is already taken!"
          );
        } else {
          res.redirect(
            "/adminSignup?error=An error occurred while processing your request."
          );
        }
      } else {
        console.log(err);
        res.redirect(
          "/adminSignup?error=An error occurred while processing your request."
        );
      }
    }
  }
);

passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

app.post(
  "/database/add/new",
  upload.single("profilePicture"),
  async function (req, res) {
    //specificly passport setup
    try {
      const newStudent = await signupController.signupStudent(req, res);
      Student.register(newStudent, req.body.password, (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/database/add?error=" + err.message);
        } else {
          res.redirect("/database/add?success=Success");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
    //specificly passport setup
  }
);

app.post("/admin/application/appId/:id/delete", async (req, res) => {
  try {
    const application = await ApplicationModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/pending/applications");
  } catch (err) {
    console.log(err);
  }
});

app.post("/sendNotifications", async function (req, res) {
  try {
    await NotificationController.sendNotifications(req, res);
  } catch (err) {
    res.redirect("/admin/sendreminder?message=" + err.message);
  }
});

app.get("/admin/sendreminder", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin?error=please login to continue");
  } else {
    res.render("reminders", { admin: req.session.adminDetails });
  }
});

app.post("/sendreminder", async function (req, res) {
  try {
    await NotificationController.sendReminder(req, res);
  } catch (err) {
    console.log(err);
    res.redirect(
      "/admin/sendreminder?error=An error occured while sending reminders"
    );
  }
});

//Updating Reminders Not Functional API
// app.put("/sendreminder", async function (req, res) {

//   const allReminders = await RemindersModel.find({ class: req.body.class });
//   const sendReminder = {
//     tfee: req.body.tfee,
//     hfee: req.body.hfee,
//     mfee: req.body.mfee,
//     trfee: req.body.trfee,
//     totalFee: req.body.totalfee
//   };
//   try {
//     allReminders.forEach(reminder => {
//       RemindersModel.findOneAndUpdate({ _id: reminder._id }, sendReminder).then(() => {
//         console.log("Model updated successfully");
//       });
//     });

//     res.send("All reminders updated successfully");
//   } catch (error) {
//     // Handle error
//     res.status(500).send("An error occurred while updating reminders");
//   }
// })

app.get("/admin/transactions/:id/show/paymentSlip", async function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login?error=You better login first to load your data");
  } else {
    const slipData = await studentPortalController.viewSlip(req, res);

    res.render("paymentSlip", {
      transactionAlreadyPresent: slipData.transactionAlreadyPresent,
      paymentStatus: slipData.paymentStatus,
      transaction: slipData.transaction,
      data: slipData.reminder,
      cssPath: "/css/paymentSlip.css",
      mediaPath: "/img/",
    });
  }
});

app.post(
  "/applyOnline",
  upload.single("profilePicture"),
  async function (req, res) {
    await signupController.applyOnline(req, res);
    res.redirect(
      "/applyOnline?message=Your application has been filed succefully'"
    );
  }
);

//Not yet programmed

app.get("/database/teacher/:teachersid", async function (req, res) {
  const teachersid = req.params.id;
  console.log(teachersid);
  res.render("/teacher-dashboard");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/signUp", function (req, res) {
  res.render("signup");
});

app.get("/search/result", async function (req, res) {
  res.render("searchresult");
});
let searchResult = "";
app.post("/search/result", async function (req, res) {
  try {
    searchResult = await Student.findOne({
      rollno: req.body.rollno,
      fname: req.body.name,
    });
    if (searchResult == null) {
      res.redirect("/search/result?error=Student Not Found");
    } else {
      res.redirect("/results");
    }
  } catch (err) {
    res.redirect("/search/result?error=" + err.message);
  }
});
app.get("/results", async function (req, res) {
  res.render("results", { result: searchResult });
});

//Not yet programmed

app.get("/admin/database/:post", async function (req, res) {
  const post = req.params.post;
  console.log(post);
});
//Not yet programmed

app.get("/admin", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    await adminControllers.getCounts(req, res);
  }
});

app.get("/database/students", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    const studetnsData = await Student.find({});
    res.render("database", {
      data: studetnsData,
      admin: req.session.adminDetails,
      role: "Student",
      totall: studetnsData.length,
    });
  }
});
app.get("/database/teachers", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    const data = await teacherModel.find({});
    res.render("database", {
      data: data,
      admin: req.session.adminDetails,
      role: "Teacher",
      totall: data.length,
    });
  }
});
app.get("/database/admins", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    const data = await adminModel.find({});
    res.render("database", {
      data: data,
      admin: req.session.adminDetails,
      role: "Admin",
      totall: data.length,
    });
  }
});
app.get("/admin/pending/transactions", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    const transactions = await paymentVerifcationModel.find({
      view: "Pending",
    });
    const no = transactions.length;
    res.render("pendingTransactions", {
      transaction: transactions,
      no: no,
      admin: req.session.adminDetails,
    });
  }
});

app.get("/admin/transaction/txid/:txid", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    const transaction = await paymentVerifcationModel.findById(req.params.txid);
    console.log(transaction);
    const student = await Student.findById(transaction.studentId);
    const invoice = await RemindersModel.findById(transaction.invoiceId);
    res.render("transaction", {
      admin: req.session.adminDetails,
      transaction: transaction,
      invoice: invoice,
      student: student,
    });
  }
});

///showing students approved/declined transactions
app.get("/admin/transaction/txid/:txid/student", async function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login?error=Please login first");
  } else {
    const transaction = await paymentVerifcationModel.findById(req.params.txid);
    const student = await Student.findById(transaction.studentId);
    const invoice = await RemindersModel.findById(transaction.invoiceId);
    res.render("studentsPortal/student-transaction", {
      admin: req.session.adminDetails,
      transaction: transaction,
      item: invoice,
      student: student,
      reminders: await RemindersModel.find({ studentId: req.user.id }).sort({
        remindersCount: -1,
      }),
      data: await Student.findById(req.user.id),
      notifyMe: await Notifications.find({}).sort({ notificationsCount: -1 }),
    });
  }
});
///showing students approved/declined transactions

app.get("/admin/approved/transactions", async function (req, res) {
  const data = await paymentVerifcationModel.find({
    paymentStatus: "Approved" || "approved",
  });
  res.render("approvedTransactions", {
    transaction: data,
    no: data.length,
    admin: req.session.adminDetails,
  });
});

app.get("/admin/declined/transactions", async function (req, res) {
  const data = await paymentVerifcationModel.find({
    paymentStatus: "Declined" || "declined",
  });
  res.render("declinedTransactions", {
    transaction: data,
    no: data.length,
    admin: req.session.adminDetails,
  });
});

app.post("/admin/transaction/txid/:txid/update", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    try {
      await adminControllers.reviewsTransaction(req, res);
    } catch (error) {
      res.redirect(
        "/admin/transaction/txid/" +
          req.params.txid +
          "?message=Something went wrong while updating the transaction"
      );
    }
  }
});

app.get("/admin/application/appId/:id", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    const id = req.params.id;
    const application = await ApplicationModel.find({ _id: id });
    console.log(application);
    res.render("application", {
      uploads: "/uploads/dps/",
      application: application,
      cssPath: "/css/paymentSlip.css",
      mediaPath: "/img/",
    });
  }
});
app.get("/admin/database/transactions", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    res.render("transactions");
  }
});

app.get("/admin/transactions/appId/:id", async function (req, res) {
  const id = req.params.id;
  const transactions = await transactions.find({ _id: id });
  res.render("transactions", { transactions: transactions });
});

app.get("/academics", function (req, res) {
  res.render("academics");
});

app.get("/students/reviews", async function (req, res) {
  const data = await ReviewsModel.find({});
  res.render("reviews", { reviews: data });
});

app.post("/database/postReviews", function (req, res) {
  const name = req.body.name;
  const department = req.body.field;
  const review = req.body.review;
  const newReview = new ReviewsModel({
    name: name,
    department: department,
    review: review,
  });
  newReview.save().then(() => {
    res.redirect("/students/reviews");
  });
});

app.get("/database/add", function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    res.render("add", { admin: req.session.adminDetails });
  }
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login?error=" + encodeURIComponent(info.message));
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/target");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.session.adminIsAuthorised = false;
  req.logout((err) => {
    console.log(err);
  });
  res.redirect("/"); // Redirect to the homepage or any other desired page
});

app.get("/target", async function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  } else {
    await studentPortalController.loadTarget(req, res);
  }
});

app.get(
  "/target/student/:class/:username/selectedCourse",
  async function (req, res) {
    if (!req.isAuthenticated()) {
      res.redirect("/login");
    } else {
      const notifications = await Notification.find({
        class: req.user.class,
      }).sort({ notificationsCount: -1 });
      const reminders = await RemindersModel.find({
        username: req.user.username,
      }).sort({ remindersCount: -1 });
      res.render("selectedCourse", {
        notifyMe: notifications,
        reminders: reminders,
        today: new Date().toLocaleDateString(),
      });
    }
  }
);

app.get("/database/:role/:id/aboutMe/:email", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    try {
      const id = req.params.id;
      const email = req.params.email;
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
      console.log(data);
      res.render("aboutTheStudent", {
        item: data,
        cssPath: "/css/paymentSlip.css",
      });
    } catch (e) {
      console.log(e);
    }
  }
});

app.post(
  "/transaction/:invoiceId/payNow",
  uploadSlips.single("paymentReciept"),
  async function (req, res) {
    await adminControllers
      .verifyTransaction(req, res)
      .then(() => {
        res.redirect("/target");
      })
      .catch((e) => {
        console.log(e);
        res.send("faild to verify payment cause of " + e.message);
      });
  }
);

const percentage = {
  first: 99,
  second: 93,
  third: 81,
  fourth: 75,
  fifth: 68,
};

app.get("/admin/tboard", async function (req, res) {
  if (!req.session.teacherIsAuthorised) {
    res.redirect(
      "/tboard/login?error=You need to have Category-B privileges for accessing this page"
    );
  } else {
    const quizes = await quizModel
      .find({ teacherId: req.session.teacherId })
      .sort({ quizNumberCount: -1 })
      .limit(4);

    const teacher = await teacherModel.findById(req.session.teacherId);
    console.log(teacher);
    res.render("tboard", {
      teacher: teacher,
      percentage: percentage,
      admin: teacher,
      name: "Admin",
      quizes: quizes,
      teacherId: await teacherModel.findById(req.session.teacherId),
    });
  }
});

app.post("/admin/tboard/update/aboutMe", async function (req, res) {
  if (!req.session.teacherIsAuthorised) {
    res.redirect(
      "/tboard/login?error=You need to have Category-B privileges for accessing this page"
    );
  } else {
    try {
      const update = {
        aboutMe: req.body.aboutMe,
      };
      await teacherModel.findByIdAndUpdate(req.session.teacherId, update);
    } catch (e) {}
  }
});
app.post("/admin/tboard/update/qualifications", async function (req, res) {
  if (!req.session.teacherIsAuthorised) {
    res.redirect(
      "/tboard/login?error=You need to have Category-B privileges for accessing this page"
    );
  } else {
    try {
      const update = {
        aboutMe: req.body.qualifications,
      };
      await teacherModel.findByIdAndUpdate(req.session.teacherId, update);
    } catch (e) {}
  }
});

app.get("/admin/tbpard/pendingApplications", async (req, res) => {
  res.render("pendingApplicationsOnTboard", {
    name: "Admin",
    percentage: percentage,
  });
});

app.post(
  "/admin/tboard/upload/quiz",
  uploadQuiz.array("uploadContent"),
  async function (req, res) {
    if (!req.session.teacherIsAuthorised) {
      res.redirect(
        "/tboard/login?error=You need to have Category-B privileges for accessing this page"
      );
    } else {
      await tboardControllers.uploadQuiz(req, res);
    }
  }
);

app.get("/admin/Signup/teacher", async function (req, res) {
  if (!req.session.adminIsAuthorised) {
    res.redirect("/adminLogin");
  } else {
    res.render("teacherSignup");
  }
});

app.post(
  "/admin/Signup/teacher",
  upload.single("profilePicture"),
  async function (req, res) {
    await signupController.signupTeacher(req, res);
  }
);

app.get("/tboard/login", async function (req, res) {
  res.render("tboard_login");
});

app.post("/tboard/login", async function (req, res) {
  await loginController.teacherLogin(req, res);
});

app.get("/admin/tboard/grade/pending/quizes", async function (req, res) {
  await tboardControllers.loadQuizes(req, res);
});

app.get(
  "/admin/tboard/pendingQuizes/uploadResults/:id/:quizId",
  async function (req, res) {
    await tboardControllers.uploadQuizResults(req, res);
  }
);

app.post(
  "/admin/tboard/pendingQuizes/uploadResults/:id/:quizId/submit",
  async function (req, res) {
    await tboardControllers.gradeStudents(req, res);
  }
);
app.post("/delete/quiz/:id/delete", async function (req, res) {
  if (!req.session.teacherIsAuthorised) {
    res.redirect(
      "/tboard/login?error=You need to have Category-B privileges for accessing this page"
    );
  } else {
    await quizModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/tboard/grade/pending/quizes");
  }
});
app.get(
  "/target/:username/:userid/:grade/:selctedCourse",
  async function (req, res) {
    if (!req.isAuthenticated()) {
      res.redirect("/login?error=Login timeout.Please login again");
    } else {
      const reminders = await RemindersModel.find({
        username: req.params.username,
      })
        .sort({ remindersCount: -1 })
        .limit(10);
      const notifications = await Notification.find({
        username: req.params.username,
      })
        .sort({ notificationsCount: -1 })
        .limit(10);
      const name = await Student.findById(req.params.userid).fname;
      const lectures = await lectureModel.find({
        class: req.params.grade,
        subject: req.params.selctedCourse,
      });
      console.log(lectures);
      res.render("studentsPortal/course", {
        notifyMe: notifications,
        reminders: reminders,
        nam: name,
        lectures: lectures,
        percentage: percentage,
        data: req.user,
      });
    }
  }
);
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  res.download("public/uploads/tboard/lecture/" + filename, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("File not found");
    }
  });
});
app.post(
  "/admin/tboard/upload/media",
  lecturesUpload.array("files"),
  async function (req, res) {
    await tboardControllers.uploadLectures(req, res);
  }
);
app.get("/admin/tboard/uploads/Course", async function (req, res) {
  if (!req.session.teacherIsAuthorised) {
    res.redirect(
      "/tboard/login?error=You need to have Category-B privileges for accessing this page"
    );
  } else {
    try {
      res.render("searchLectures", {
        admin: await teacherModel.findById(req.session.teacherId),
        percentage: percentage,
      });
    } catch (e) {
      res.redirect("/admin/tboard/message=" + e.message);
    }
  }
});
app.post("/admin/tboard/uploads/Course", async function (req, res) {
  if (!req.session.teacherIsAuthorised) {
    res.redirect(
      "/tboard/login?error=You need to have Category-B privileges for accessing this page"
    );
  } else {
    try {
      const lecturesUploaded = await lectureModel.find({
        teacherId: req.session.teacherId,
        class: req.body.class,
        subject: req.body.subject,
      });
      console.log(lecturesUploaded);
      if (lecturesUploaded.length == 0) {
        res.redirect(
          '/admin/tboard/uploads/Course?error="No lectures were found under the given query"'
        );
      } else {
        res.render("uploadedLectures", {
          lectures: lecturesUploaded,
          percentage: percentage,
          admin: await teacherModel.findById(req.session.teacherId),
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }
});
app.get("/blog", async function (req, res) {
  try {
    const blogPosts = await blogController.getBlogPosts();
    const results = blogPosts.length;
    res.render("blogIndex", { post: blogPosts, results: results });
  } catch (e) {
    res.redirect("/blog?message=" + e.message);
  }
});

app.get("/blog/new/post", async function (req, res) {
  res.render("writeBlog");
});
app.get("/blog/post/:id/view", async function (req, res) {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      // Handle case when the post is not found
      return res.status(404).send("Post not found");
    }
    const aboutTheAuthor = await teacherModel.findById(
      "64a972ec2bea8f56f7ffd35c"
    );
    const comments = await PostComments.find({ postId: req.params.id });
    console.log(aboutTheAuthor);
    const senetizedPost = sanitizeHtml(post.post);
    const blogposts = await Blog.find({});
    res.render("viewPost", {
      posts: senetizedPost,
      post: post,
      aboutTheAuthor: aboutTheAuthor,
      blogposts: blogposts,
      comments: comments,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/blog/post/:id/view", async function (req, res) {
  try {
    await blogController
      .postComment(req, res)
      .then(
        res.redirect("/blog/post/" + req.params.id + "/view?message=Posted")
      );
  } catch (err) {
    console.log(err);
    res.redirect(
      "/blog/post/" + req.params.id + "/view?message=" + err.message
    );
  }
});
app.post("/blog/new/post", blog.single("thumbnail"), async function (req, res) {
  try {
    await blogController.makePost(req, res);
    res.redirect("/blog?message=Success");
  } catch (err) {
    res.redirect("/blog?message=" + err.message);
  }
});

app.get("/blog/yourPosts/all", async function (req, res) {
  if (
    !req.isAuthenticated() ||
    !req.session.adminIsAuthorised ||
    !req.session.teacherIsAuthorised
  ) {
    res.redirect("/login?error=Please Login to confirm your identity");
  } else {
    const posts = await Blog.find({ authourId: req.user._id });
  }
});
app.get("/complaint", async function (req, res) {
  res.render("complaint");
});
app.get("/faculty", async function (req, res) {
  const faculty = await teacherModel.find({});
  res.render("faculty", { faculty: faculty });
});
app.listen(process.env.PORT, () =>
  console.log(`The sever is up on port ${process.env.PORT}!`)
);

// fs.unlink("public/uploads/tboard/lecture/index.html",(err)=>{
//   console.log(err)
// })
