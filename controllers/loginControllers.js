const { adminModel, teacherModel } = require("../module/schema");
const bcrypt = require("bcrypt");

async function adminLogin(req, res) {
  const { email, password } = req.body;

  const auth = await adminModel.findOne({ email });
  if (!auth) {
    return res.redirect("/adminLogin?error=Invalid Email Address");
  }
  const passwordMatch = await bcrypt.compare(password, auth.password);
  if (!passwordMatch) {
    return res.redirect("/adminLogin?error=Invalid Password");
  }
  if (auth != null && passwordMatch == true) {
    // Authentication successful
    req.session.adminDetails = await adminModel.findOne({
      email: req.body.email,
    });
    req.session.adminIsAuthorised = true; // Store authentication status in session
    req.session.adminId = req.body.email;
    res.redirect("/admin");
  }
}

async function teacherLogin(req, res) {
  try {
    const { email, password } = req.body;

    const auth = await teacherModel.findOne({ email });
    if (!auth) {
      return res.redirect("/tboard/login?error=Invalid Email Address");
    }

    const passwordMatch = await bcrypt.compare(password, auth.password);
    if (!passwordMatch) {
      return res.redirect("/tboard/login?error=Invalid Password");
    }

    // Authentication successful
    req.session.teacherIsAuthorised = true; // Store authentication status in session
    req.session.teacherId = auth.id;
    req.session.teacherDetails = await teacherModel.findById(auth.id);

    console.log(req.session);
    res.redirect("/admin/tboard");
  } catch (error) {
    console.error(error);
    res.redirect("/tboard/login?error=Internal Server Error");
  }
}
module.exports = { adminLogin, teacherLogin };
