const express = require('express');
const prisma = require('../lib/prisma');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get all tokens for a design system
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
    
    const tokens = await prisma.token.findMany({
      where: { systemId: req.params.systemId },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    
    res.json({ tokens });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Create new token
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, category, value, systemId } = req.body;
    
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: systemId,
        userId: req.user.id 
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    if (!name || !category || !value) {
      return res.status(400).json({ error: 'Name, category, and value are required' });
    }
    
    const token = await prisma.token.create({
      data: {
        name,
        category,
        value,
        systemId
      }
    });
    
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

// Update token
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, category, value } = req.body;
    
    const token = await prisma.token.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!token || token.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    if (!name || !category || !value) {
      return res.status(400).json({ error: 'Name, category, and value are required' });
    }
    
    const updatedToken = await prisma.token.update({
      where: { id: req.params.id },
      data: { name, category, value }
    });
    
    res.json({ token: updatedToken });
  } catch (error) {
    console.error('Error updating token:', error);
    res.status(500).json({ error: 'Failed to update token' });
  }
});

// Delete token
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const token = await prisma.token.findUnique({
      where: { id: req.params.id },
      include: { system: true }
    });
    
    if (!token || token.system.userId !== req.user.id) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    await prisma.token.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Token deleted successfully' });
  } catch (error) {
    console.error('Error deleting token:', error);
    res.status(500).json({ error: 'Failed to delete token' });
  }
});

module.exports = router;
