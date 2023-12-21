const mongoose = require('mongoose')
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
    console.log('Connected to the database'))

// mongoose.connect('mongodb://127.0.0.1:27017/College', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>

// console.log('Connected to the database'))
