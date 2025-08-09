import express from 'express'
import { 
  createStock, 
  getAllStocks, 
  getStockById, 
  updateStock, 
  deleteStock,
  getStockSummary
} from '../controller/stockController.js'

const router = express.Router()

// Create a new stock
router.post('/', createStock)

// Get all stocks
router.get('/', getAllStocks)

// Get stock by ID
router.get('/:id', getStockById)

// Update stock
router.put('/:id', updateStock)

// Delete stock
router.delete('/:id', deleteStock)

// Get stock summary
router.get('/get/summary', getStockSummary)

export default router
