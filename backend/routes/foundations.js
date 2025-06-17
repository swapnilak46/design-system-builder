const express = require('express');
const prisma = require('../lib/prisma');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get all foundations for a design system
router.get('/system/:systemId', isAuthenticated, async (req, res) => {
  try {
    // Verify user owns the system
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: req.params.systemId,
        userId: req.user.id 
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    const foundations = await prisma.foundation.findMany({
      where: { systemId: req.params.systemId },
      orderBy: { type: 'asc' }
    });
    
    res.json({ foundations });
  } catch (error) {
    console.error('Error fetching foundations:', error);
    res.status(500).json({ error: 'Failed to fetch foundations' });
  }
});

// Create new foundation
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { type, values, systemId } = req.body;
    
    // Verify user owns the system
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: systemId,
        userId: req.user.id 
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    if (!type || !values) {
      return res.status(400).json({ error: 'Type and values are required' });
    }
    
    const foundation = await prisma.foundation.create({
      data: {
        type,
        values,
        systemId
      }
    });
    
    res.status(201).json({ foundation });
  } catch (error) {
    console.error('Error creating foundation:', error);
    res.status(500).json({ error: 'Failed to create foundation' });
  }
});

// Update foundation
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { type, values } = req.body;
    
    // Verify user owns the foundation's system
    const foundation = await prisma.foundation.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!foundation || foundation.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Foundation not found' });
    }
    
    if (!type || !values) {
      return res.status(400).json({ error: 'Type and values are required' });
    }
    
    const updatedFoundation = await prisma.foundation.update({
      where: { id: req.params.id },
      data: { type, values }
    });
    
    res.json({ foundation: updatedFoundation });
  } catch (error) {
    console.error('Error updating foundation:', error);
    res.status(500).json({ error: 'Failed to update foundation' });
  }
});

// Delete foundation
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    // Verify user owns the foundation's system
    const foundation = await prisma.foundation.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!foundation || foundation.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Foundation not found' });
    }
    
    await prisma.foundation.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Foundation deleted successfully' });
  } catch (error) {
    console.error('Error deleting foundation:', error);
    res.status(500).json({ error: 'Failed to delete foundation' });
  }
});

module.exports = router;
