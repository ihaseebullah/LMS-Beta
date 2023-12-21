const multer = require('multer');
// Create a function to set up multer middleware
function setupMulter(destination) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
}
const upload = multer({ storage: setupMulter('public/uploads/dps') });
const blog = multer({ storage: setupMulter('public/uploads/blog') });
const uploadQuiz = multer({ storage: setupMulter('public/uploads/quiz') });
const uploadSlips = multer({ storage: setupMulter('public/uploads/paymentSlips') });
const tboard_media = multer({ storage: setupMulter('public/uploads/tboard') });
const lecturesUpload = multer({ storage: setupMulter('public/uploads/tboard/lecture') });

// ... Set up other multer instances using the same setupMulter function ...

module.exports = { upload, blog, uploadQuiz, uploadSlips, tboard_media, lecturesUpload }