import express from 'express'
import { protect } from '../middleware/protect.js'
import { getThreads } from '../controllers/thread.js'

const router = express.Router()

router.get('/', protect, getThreads)

export default router