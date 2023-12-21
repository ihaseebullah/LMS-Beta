const bcrypt = require('bcrypt')
const { adminModel, ApplicationModel, teacherModel, Student } = require('../module/schema');

//Admin Signups
async function adminSignUp(req, res) {
    if (!req.session.adminIsAuthorised) {
        res.redirect('/adminLogin?error=Please login to continue');
    } else {
        const saltRounds = 10; // Define the number of salt rounds for bcrypt hashing
        const salt = await bcrypt.genSalt(saltRounds);
        const newAdmin = new adminModel({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fatherName: req.body.fatherName,
            cnic: req.body.cnic,
            phone: req.body.phone,
            address: req.body.address,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
            role: req.body.role,
            profilePicture: req.file,
            about: req.body.about
        });
        await newAdmin.save();
        res.redirect("/adminSignup?success=" + req.body.firstName + " " + req.body.lastName + " Email=" + req.body.email + " has been added as a superuser");
        console.log(newAdmin);
        console.log("The admin with above credentials has been added to the database and we granted him access to the system");
    }
}
//Category B users Signups

async function signupTeacher(req, res) {

    if (!req.session.adminIsAuthorised) {
        res.redirect('/adminLogin')
    } else {
        try {
            if (req.file.size > 100000) {
                res.redirect("/admin/Signup/teacher?error=The image size must be less then 1 mb the image you provided is " + req.file.size / 100000 + " Mb ")
            } else {
                const saltRounds = 10; // Define the number of salt rounds for bcrypt hashing
                const salt = await bcrypt.genSalt(saltRounds);
                const newTeacherSignup = new teacherModel({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    fatherName: req.body.fatherName,
                    cnic: req.body.cnic,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, salt),
                    address: req.body.address,
                    phone: req.body.phone,
                    role: req.body.role,
                    age: req.body.age,
                    gender: req.body.gender,
                    dateOfBirth: req.body.dateOfBirth,
                    profilePicture: req.file,
                    profileNumber: req.body.profileNumber,
                    about: req.body.about,
                })
                await newTeacherSignup.save().then(() => {
                    res.render('success')
                })
            }

        } catch (error) {
            console.log(error)
            res.redirect('/admin/Signup/teacher?error= ' + error.keyValue.email || error.keyValue.cnic + " has already been signed up")
        }
    }



}

//Online Application Form
async function applyOnline(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const fatherName = req.body.fatherName;
    const motherName = req.body.motherName;
    const cnic = req.body.cnic;
    const email = req.body.email;
    const address = req.body.address;
    const age = req.body.age;
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth;
    const lastInstitution = req.body.lastInstitution;
    const yearsStudeid = req.body.yearsStudeid;
    const reasonForLeaving = req.body.reasonForLeaving;
    const lastDegreeMarks = req.body.lastDegreeMarks;
    const lastDegreePercentage = req.body.lastDegreePercentage;
    const about = req.body.about;
    console.log(req.body.profilePicture)
    const newApplication = new ApplicationModel({
        firstName: firstName,
        lastName: lastName,
        fatherName: fatherName,
        motherName: motherName,
        cnic: cnic,
        email: email,
        age: age,
        gender: gender,
        about: about,
        dateOfBirth: dateOfBirth,
        address: address,
        lastDegree: req.body.lastDegree,
        lastInstitution: lastInstitution,
        yearsStudeid: req.body.yearsStudied,
        reasonForLeaving: reasonForLeaving,
        lastDegreeMarks: lastDegreeMarks,
        lastDegreePercentage: lastDegreePercentage,
        guardianPhone: req.body.gaurdianPhone,
        emergencyPhone: req.body.emergencyContactPhone,
        studentPhone: req.body.studentPhone,
        emergencyContact: req.body.emergencyContact,
        profilePicture: req.file.filename

    });

    newApplication.save().then(() => (console.log('file uploaded')))
}

//Student Signups
async function signupStudent(req, res) {
    const newStudent = new Student({
        fname: req.body.fname,
        lname: req.body.lname,
        cnic: req.body.cnic,
        fatherName: req.body.faname,
        mname: req.body.mname,
        username: req.body.email,
        password: req.body.password,
        previoustTotallDues: req.body.dues,
        dob: req.body.dob,
        address: req.body.address,
        gender: req.body.gender,
        age: req.body.age,
        lastinstitution: req.body.lastinstitution,
        rollno: "000" + (await Student.find({})).length,
        class: req.body.class,
        Sphone: req.body.Sphone,
        guardianPhone: req.body.guardianPhone,
        emergencyContactName: req.body.emergencyContactName,
        emergencyContactPhone: req.body.emergencyContactPhone,
        about: req.body.about,
        profilePicture: req.file
    })
    return newStudent;
}
module.exports = { adminSignUp, signupStudent, applyOnline, signupTeacher }