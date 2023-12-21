const { quizModel, teacherModel, Student, quizResultModel, lectureModel } = require('..//module/schema')

async function uploadQuiz(req, res) {
    try {
        const newQuiz = new quizModel({
            quizNumberCount: (await quizModel.find({})).length + 1,
            class: req.body.class,
            subject: req.body.subject,
            topic: req.body.topic,
            dueDate: req.body.duedate,
            quizNumber: req.body.quizNumber,
            question: req.body.question,
            teacherId: req.session.teacherId,
            filesPath: req.files,
            totallMarks: req.body.totallMarks,
            genre: req.body.genre
        })
        await newQuiz.save().then(() => { console.log("The Quiz has been uploaded and is served on the portal") }).then(() => {
            res.render('tboard-success')
        })
    } catch (e) {
        console.log(e)
    }
}

async function loadQuizes(req, res) {
    if (!req.session.teacherIsAuthorised) {
        res.redirect('/tboard/login?error=You need to have Category-B privileges for accessing this page')
    } else {
        const teacher = await teacherModel.findById(req.session.teacherId)
        const loadQuizes = await quizModel.find({ teacherId: req.session.teacherId }).sort({ quizNumberCount: -1 })
        let number = loadQuizes.length
        res.render('pendingQuizes', { name: teacher.firstName, quizes: loadQuizes, number: number })
    }
}

async function uploadQuizResults(req, res) {
    if (!req.session.teacherIsAuthorised) {
        res.redirect('/tboard/login?error=You need to have Category-B privileges for accessing this page')
    } else {
        let students = await Student.find({ class: req.params.id })
        let quiz = await quizModel.findById(req.params.quizId)
        res.render('uploadResult', { students: students, quiz: quiz, studentNumber: students.length })
    }
}

async function gradeStudents(req, res) {
    let numberOfStudents = (await Student.find({ class: req.params.id })).length
    let selectedQuiz = await quizModel.findById(req.params.quizId)

    console.log(selectedQuiz)
    try {
        if (numberOfStudents > 1) {
            for (let i = 0; i < numberOfStudents; i++) {
                const studentObject = new quizResultModel({
                    name: req.body.name[i],
                    fatherName: req.body.fname[i],
                    subject: req.body.subject[i],
                    quizId: req.body.qid[i],
                    quizNumber: req.body.quizNumber[i],
                    studentId: req.body.sId[i],
                    teacherId: req.session.teacherId,
                    marks: req.body.marks[i],
                    time: new Date().toLocaleDateString(),
                    class: req.params.id,
                    totallMarks: selectedQuiz.totallMarks,
                    totallQuizes: (await quizResultModel.find({})).length + 1
                });
                await studentObject.save().then(() => console.log(studentObject))
            }
            res.render("tboard-success")
        } else {
            const studentObject = new quizResultModel({
                name: req.body.name,
                fatherName: req.body.fname,
                subject: req.body.subject,
                quizId: req.body.qid,
                quizNumber: req.body.quizNumber,
                studentId: req.body.sId,
                teacherId: req.session.teacherId,
                marks: req.body.marks,
                time: new Date().toLocaleDateString(),
                class: req.params.id,
                totallMarks: selectedQuiz.totallMarks,
                totallQuizes: (await quizResultModel.find({})).length + 1
            })
            await studentObject.save().then(() => console.log(studentObject))
            res.render("tboard-success")
        }
    } catch (e) {
        console.log(e.message)
    }

}

async function uploadLectures(req, res) {
    if (!req.session.teacherIsAuthorised) {
        res.redirect('/tboard/login?error=You need to have Category-B privileges for accessing this page')
    } else {
        const lectureObject = new lectureModel({
            teacherId: req.session.teacherId,
            subject: req.body.subject,
            class: req.body.class,
            lectureCount: (await lectureModel.find({ teacherId: req.session.teacherId })).length + 1,
            lectureNumber: (await lectureModel.find({ class: req.body.class, subject: req.body.subject, teacherId: req.session.teacherId })).length + 1,
            topic: req.body.topic,
            duration: req.body.date,
            videoLink: convertToEmbedSrc(req.body.link),
            description: req.body.description,
            filesPath: req.files
        })
        await lectureObject.save().then(() => {
            res.render('tboard-success')
        })
    }
}
module.exports = { uploadQuiz, loadQuizes, uploadQuizResults, gradeStudents, uploadLectures }