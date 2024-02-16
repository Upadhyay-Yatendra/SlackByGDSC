import express from 'express'
import { createTeammates, getTeammate } from '../controllers/teammates.js'
import { protect } from '../middleware/protect.js'

const router = express.Router()

router.get('/:id', protect, getTeammate)
router.post('/', protect, createTeammates)

export default router
