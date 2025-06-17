const express = require('express');
const prisma = require('../lib/prisma');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get all design systems for authenticated user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const systems = await prisma.designSystem.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: {
            foundations: true,
            components: true,
            tokens: true,
            docs: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json({ systems });
  } catch (error) {
    console.error('Error fetching design systems:', error);
    res.status(500).json({ error: 'Failed to fetch design systems' });
  }
});

// Get single design system by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: {
        foundations: true,
        components: true,
        tokens: true,
        docs: { orderBy: { order: 'asc' } }
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    res.json({ system });
  } catch (error) {
    console.error('Error fetching design system:', error);
    res.status(500).json({ error: 'Failed to fetch design system' });
  }
});

// Create new design system
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const system = await prisma.designSystem.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: req.user.id
      }
    });
    
    res.status(201).json({ system });
  } catch (error) {
    console.error('Error creating design system:', error);
    res.status(500).json({ error: 'Failed to create design system' });
  }
});

// Update design system
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const system = await prisma.designSystem.updateMany({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    });
    
    if (system.count === 0) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    const updatedSystem = await prisma.designSystem.findUnique({
      where: { id: req.params.id }
    });
    
    res.json({ system: updatedSystem });
  } catch (error) {
    console.error('Error updating design system:', error);
    res.status(500).json({ error: 'Failed to update design system' });
  }
});

// Delete design system
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedSystem = await prisma.designSystem.deleteMany({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (deletedSystem.count === 0) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    res.json({ message: 'Design system deleted successfully' });
  } catch (error) {
    console.error('Error deleting design system:', error);
    res.status(500).json({ error: 'Failed to delete design system' });
  }
});

module.exports = router;
