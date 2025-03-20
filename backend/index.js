import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import User from './models/User.model.js'
import Post from './models/Post.js'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(cors({ credentials: true, origin: 'https://blog-app-1-gcux.onrender.com' }))
app.use(express.json())
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
const uploadMiddleware = multer({ dest: 'uploads/' })

const salt = 10
const secret = process.env.SECRET

const PORT = process.env.PORT || 5500
const MONGO_URL = process.env.MONGO_URL

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
});


app.get('/', (req, res) => {
    console.log("App is working")
    res.send("Welcome to the blog")
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        const user = await User.create({ username, password: await bcrypt.hash(password, salt) })
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(400).json('User not found')
        }
        const passOk = await bcrypt.compare(password, user.password)
        if (passOk) {
            //logged in
            jwt.sign({ username, id: user._id }, secret, { expiresIn: '1h' }, (error, token) => {
                if (error) throw error
                res.cookie('token', token, {
                    httpOnly: true, SameSite: 'None',
                    Secure: true,
                }).json({

                    id: user._id,
                    username
                })
            })
        } else {
            res.status(400).json('Wrong credentials')
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
})

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
      }
    try {
        const info = await jwt.verify(token, secret);
        res.json(info);
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Token verification failed. Please log in again.' })
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    let filePath = 'uploads/default.jpg'; // Default image

    if (req.file) {
        const { originalname, path: oldPath } = req.file;
        const ext = path.extname(originalname);
        filePath = oldPath + ext;

        try {
            await fs.rename(oldPath, filePath); // Rename and store the image
        } catch (error) {
            console.error("Error renaming file:", error);
            return res.status(500).json({ message: "Error renaming file.", error: error.message });
        }
    }

    const { token } = req.cookies;

    try {
        const info = jwt.verify(token, secret);
        const { title, summary, content } = req.body;

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: filePath,  // Save file path or default
            author: info.id,  // Assign post author
        });

        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong while creating the post' });
    }
});


app.get('/post', async (req, res) => {
    res.json(await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20))
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const postDoc = await Post.findById(id).populate('author', ['username'])
    res.json(postDoc)
})


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null

    if (req.file) {

        const { originalname, path: oldPath } = req.file
        const ext = path.extname(originalname)
        newPath = oldPath + ext
        try {
            await fs.rename(oldPath, newPath); // This works because fs.promises.rename() returns a promise
        } catch (error) {
            console.error("Error renaming file:", error);
            return res.status(500).json({ message: "Error renaming file.", error: error.message });
        }

    }
    console.log(req.body)
    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        const { id, title, summary, content } = req.body
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
        if (!isAuthor) {
            res.status(403).json('You are not the author')
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath || postDoc.cover
        })

        res.json(postDoc)
    })

})

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;

    try {
        const info = await jwt.verify(token, secret);

        const postDoc = await Post.findById(id);

        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(403).json({ message: 'You are not the author of this post' });
        }


        if (postDoc.cover !== 'uploads/default.jpg') {
            const filePath = path.join(__dirname, postDoc.cover);
            try {
                await fs.unlink(filePath);
                console.log(`File deleted: ${filePath}`);
            } catch (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ message: 'Error deleting file', error: err.message });
            }
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(id);

        // Return a success response
        return res.json({ message: 'Post and its file deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`)
    try {
        mongoose.connect(MONGO_URL).then(() => {
            console.log('Connected to MongoDB')
        })

    } catch (error) {
        console.log('Error connecting to MongoDB')

    }
})

