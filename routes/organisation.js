import express from 'express'
import { protect } from '../middleware/protect.js'
import {
  createOrganisation,
  getOrganisation,
  getWorkspaces,
} from '../controllers/organisation.js'

const router = express.Router()

router.get('/workspaces', protect, getWorkspaces)
router.get('/:id', protect, getOrganisation)
router.post('/', protect, createOrganisation)

export default router