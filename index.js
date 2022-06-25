import express from 'express'
import mongoose from "mongoose";
import multer from 'multer'

import checkAuth from "./utils/checkAuth.js";

import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";

import * as authController from "./controllers/userController.js";
import * as postController from "./controllers/postController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

//------MONGOOSE------
mongoose
    .connect('mongodb+srv://admin:mern-lesson-1@mern-lesson-1.bu5oc59.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {console.log('DB on')})
    .catch((err) => {console.log('DB error', err)})

//------EXPRESS------
const app = express()
app.use(express.json());
app.use("/uploads", express.static("uploads"))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

//------QUERY-AUTH------
app.post('/auth/login', loginValidation, handleValidationErrors, authController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, authController.register)
app.get('/auth/me', checkAuth, authController.getMe)

//------
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})


//------QUERY-POSTS------
app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getOne)

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', postCreateValidation, checkAuth, handleValidationErrors, postController.update)

//------LOCALHOST------
app.listen(666, (err) => {
    if (err){
        return console.log(err)
    }
    console.log('Server on')

})