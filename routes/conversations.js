import express from 'express'
import { getConversation, getConversations } from '../controllers/conversations.js'
import { protect } from '../middleware/protect.js'

const router = express.Router()

router.get('/', protect, getConversations)
router.get('/:id', protect, getConversation)

export default router