const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const applicationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  fatherName: String,
  motherName: String,
  cnic: String,
  email: String,
  age: String,
  gender: String,
  about: String,
  dateOfBirth: String,
  address: String,
  education: String,
  lastInstitution: String,
  yearsStudeid: String,
  reasonForLeaving: String,
  lastDegreeMarks: String,
  lastDegreePercentage: String,
  profilePicture: String,
  guardianPhone: String,
  emergencyPhone: String,
  studentPhone: String,
  emergencyContact: String,
  timeStamp: { type: String, default: new Date().toLocaleString() }
})

const ApplicationModel = mongoose.model('Application', applicationSchema)
const studentSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  cnic: String,
  fatherName: String,
  mname: String,
  username: { type: String }, // Make the username field unique
  password: String,
  dob: String,
  dues: Number,
  role: { type: String, default: "student" },
  address: String,
  gender: String,
  age: String,
  lastinstitution: String,
  rollno: Number,
  class: Number,
  Sphone: String,
  guardianPhone: String,
  emergencyContactName: String,
  emergencyContactPhone: String,
  profilePicture: Object,
  previoustTotallDues: Number,
});

// Add passport-local-mongoose plugin
studentSchema.plugin(passportLocalMongoose, { usernameField: 'username' });

const Student = mongoose.model('Student', studentSchema);

const reviewsSchema = new mongoose.Schema({
  name: String,
  department: String,
  review: String
})
const ReviewsModel = mongoose.model('reviews', reviewsSchema)

const reminderSchema = new mongoose.Schema({
  remindersCount: Number,
  name: String,
  fatherName: String,
  username: String,
  studentId: String,
  class: Number,
  rollno: Number,
  message: String,
  issueDate: String,
  month: String,
  dueDate: String,
  tutionFee: Number,
  hostelFee: Number,
  transportFee: Number,
  duePayments: Number,
  tax: Number,
  totall: Number,
  paymentStatus: String,
  previoustTotallDues: Number,
  totallUnPaidDues: Number,
  timestamp: { type: String, default: new Date().toLocaleString() },

})
const RemindersModel = mongoose.model('reminders', reminderSchema)

const slipSchema = new mongoose.Schema({
  slipCount: Number,
  name: String,
  rollno: String,
  class: Number,
  tufee: Number,
  hfee: Number,
  trfee: Number,
  issueDate: String,
  dueDate: String
})
const slipModel = mongoose.model('Slip', slipSchema)

const notificationsSchema = new mongoose.Schema({
  notificationCount: Number,
  class: String,
  timestamp: { type: Date, default: Date.now() },
  message: String,
})
const Notifications = mongoose.model('Notification', notificationsSchema)

const adminSignup = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  password: String,
  lastName: { type: String, required: true },
  fatherName: String,
  cnic: { type: String, unique: true, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  age: { type: String, required: true },
  role: { type: String, required: true },
  profilePicture: { type: Object, },
  about: { type: String, required: true },
  employeeDate: { type: String, default: new Date().toLocaleString() },
})

const adminModel = mongoose.model('Admin', adminSignup)
const paymentVerifcationSchema = new mongoose.Schema({
  paymentVerificationCount: Number,
  name: String,
  fatherName: String,
  username: String,
  studentId: String,
  class: Number,
  rollno: Number,
  message: String,
  amountPaid: Number,
  paymentStatus: String,
  paymentMethod: String,
  paymentDate: String,
  txId: String,
  paymentReciept: Object,
  invoiceId: String,
  month: String,
  comments: String,
  tuitionFee: Number,
  hostelFee: Number,
  transpoartFee: Number,
  previoustTotallDues: Number,
  totallUnPaidDues: Number,
  view: { type: String, default: "Pending" },
  comments: String,
  timestamp: { type: String, default: new Date().toLocaleString() },
});
const paymentVerifcationModel = mongoose.model('Payment_Verification', paymentVerifcationSchema)
const quizSchema = new mongoose.Schema({
  quizNumberCount: Number,
  class: Number,
  subject: String,
  topic: String,
  Date: { type: String, default: new Date().toLocaleDateString() },
  dueDate: String,
  quizNumber: Number,
  filesPath: Array,
  question: String,
  teacherId: String,
  totallMarks: Number,
  genre: String
})
const quizModel = mongoose.model('Quiz', quizSchema)
const teacherSchema = new mongoose.Schema({
  teacherCount: Number,
  firstName: String,
  lastName: String,
  fatherName: String,
  cnic: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  address: String,
  phone: String,
  role: String,
  age: String,
  gender: String,
  dateOfBirth: String,
  profilePicture: Object,
  profileNumber: String,
  aboutMe: String,
  qualification: String,
  performance: Number,
  signupDate: { type: String, default: new Date().toLocaleDateString() }
})
const teacherModel = mongoose.model('teacher', teacherSchema)
const result = new mongoose.Schema({
  rollno: Number,
  studentId: String,
  studentName: String,
  rollno: Number,
  taskNature: String,
  class: Number,
  subject: String,
  topic: String,
  obtainMarks: Number,
  totallMarks: Number,
  percentage: Number,
  resultUploadTime: { type: String, default: new Date().toLocaleDateString() }
})
const ResultModel = mongoose.model('Result', result)
const quizResultSchema = new mongoose.Schema({
  totallQuizes: Number,
  class: Number,
  name: String,
  fatherName: String,
  subject: String,
  quizId: String,
  quizNumber: Number,
  studentId: String,
  teacherId: String,
  marks: Number,
  time: String,
  totallMarks: Number,
})
const quizResultModel = mongoose.model('Quiz-Result', quizResultSchema)
const lecturesSchema = new mongoose.Schema({
  teacherId: String,
  class: Number,
  subject: String,
  lectureCount: Number,
  lectureNumber: Number,
  topic: String,
  duration: String,
  videoLink: String,
  description: String,
  filesPath: Array,
  time: { type: String, default: new Date().toDateString() }
})
const lectureModel = mongoose.model('Lecture', lecturesSchema)
const blogSpot = new mongoose.Schema({
  postCount: Number,
  title: String,
  description: String,
  thumbnail: Object,
  authourId: String,
  post: String,
  time: { type: String, default: new Date().toDateString() }

})
const Blog = mongoose.model('Blog', blogSpot)
const postComments = new mongoose.Schema({
  commenterId: String,
  commentCount: Number,
  postId: String,
  name: String,
  userDetails: Object,
  comment: String,
  time: { type: String, default: new Date().toDateString() }

})

const globalFeeCounter = new mongoose.Schema({
  studentId: String,
  count: Number
})
const GlobalFeeCounter = mongoose.model('GlobalFeeCounter', globalFeeCounter)
const PostComments = mongoose.model('Post-Comments', postComments)
module.exports = {
  Student, ReviewsModel, RemindersModel, Blog, PostComments
  , slipModel, Notifications, adminModel, paymentVerifcationModel, quizModel, teacherModel, ResultModel, quizResultModel, lectureModel
  , ApplicationModel, GlobalFeeCounter
};
