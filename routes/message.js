import express from 'express'
import { protect } from '../middleware/protect.js'
import { getMessage, getMessages } from '../controllers/message.js'

const router = express.Router()

router.get('/', protect, getMessages)
router.get('/:id', protect, getMessage)

export default router