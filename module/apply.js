module.exports=function(){
    app.get('/applyOnline',function(req, res) {
    res.render('apply')
})
app.post('/applyOnline',upload.single('profilePicture'),async function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const fatherName=req.body.father;
    const motherName=req.body.mother;
    const cnic=req.body.cnic;
    const email=req.body.email;
    const address=req.body.address;
    const age=req.body.cars;
    const gender=req.body.exist;
    const dateOfBirth=req.body.birthday;
    const lastInstitution =req.body.lastinstitution;
    const yearsStudeid=req.body.yearsstudied;
    const reasonForLeaving=req.body.whyyouleft;
    const lastDegreeMarks=req.body.lastdegree;
    const lastDegreePercentage=req.body.lastpercentage;
    const about=req.body.about;
    console.log(req.body.profilePicture)
    const newApplication=new ApplicationModel({
        firstName:firstName,
        lastName:lastName,
        fatherName:fatherName,
        motherName:motherName,
        cnic:cnic,
        email:email,
        age:age,
        gender:gender,
        about:about,
        dateOfBirth:dateOfBirth,
        address:address,
        lastInstitution:lastInstitution,
        yearsStudeid:yearsStudeid,
        reasonForLeaving:reasonForLeaving,
        lastDegreeMarks:lastDegreeMarks,
        lastDegreePercentage:lastDegreePercentage,
    profilePicture:req.file.filename

});

 newApplication.save().then(()=>(console.log('file uploaded')))
res.send("Your Application has been filed succefully Yo'l be notified once your application get approved")
})
}