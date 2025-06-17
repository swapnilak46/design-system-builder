const express = require('express');
const prisma = require('../lib/prisma');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get all docs for a design system
router.get('/system/:systemId', isAuthenticated, async (req, res) => {
  try {
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: req.params.systemId,
        userId: req.user.id 
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    const docs = await prisma.docBlock.findMany({
      where: { systemId: req.params.systemId },
      orderBy: { order: 'asc' }
    });
    
    res.json({ docs });
  } catch (error) {
    console.error('Error fetching docs:', error);
    res.status(500).json({ error: 'Failed to fetch docs' });
  }
});

// Create new doc block
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, content, order, systemId } = req.body;
    
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: systemId,
        userId: req.user.id 
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const doc = await prisma.docBlock.create({
      data: {
        title,
        content,
        order: order || 0,
        systemId
      }
    });
    
    res.status(201).json({ doc });
  } catch (error) {
    console.error('Error creating doc:', error);
    res.status(500).json({ error: 'Failed to create doc' });
  }
});

// Update doc block
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, content, order } = req.body;
    
    const doc = await prisma.docBlock.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!doc || doc.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Doc not found' });
    }
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const updatedDoc = await prisma.docBlock.update({
      where: { id: req.params.id },
      data: { title, content, order: order || 0 }
    });
    
    res.json({ doc: updatedDoc });
  } catch (error) {
    console.error('Error updating doc:', error);
    res.status(500).json({ error: 'Failed to update doc' });
  }
});

// Delete doc block
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const doc = await prisma.docBlock.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!doc || doc.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Doc not found' });
    }
    
    await prisma.docBlock.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Doc deleted successfully' });
  } catch (error) {
    console.error('Error deleting doc:', error);
    res.status(500).json({ error: 'Failed to delete doc' });
  }
});

module.exports = router;
