import express from 'express'
import { 
  createOrder, 
  getAllOrders, 
  getOrderById, 
  updateOrder, 
  deleteOrder 
} from '../controller/orderController.js'

const router = express.Router()

// Create a new order
router.post('/addOrder', createOrder)

// Get all orders
router.get('/', getAllOrders)

// Get order by ID
router.get('/:id', getOrderById)

// Update order
router.put('/:id', updateOrder)

// Delete order
router.delete('/:id', deleteOrder)

export default router
