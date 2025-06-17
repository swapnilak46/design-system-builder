const express = require('express');
const prisma = require('../lib/prisma');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get all components for a design system
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
    
    const components = await prisma.component.findMany({
      where: { systemId: req.params.systemId },
      orderBy: { name: 'asc' }
    });
    
    res.json({ components });
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Create new component
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, category, props, styles, code, systemId } = req.body;
    
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: systemId,
        userId: req.user.id 
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const component = await prisma.component.create({
      data: {
        name,
        category,
        props: props || {},
        styles: styles || {},
        code: code || null,
        systemId
      }
    });
    
    res.status(201).json({ component });
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ error: 'Failed to create component' });
  }
});

// Update component
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, category, props, styles, code } = req.body;
    
    const component = await prisma.component.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!component || component.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    const updatedComponent = await prisma.component.update({
      where: { id: req.params.id },
      data: { name, category, props, styles, code }
    });
    
    res.json({ component: updatedComponent });
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ error: 'Failed to update component' });
  }
});

// Delete component
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!component || component.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    await prisma.component.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

module.exports = router;
