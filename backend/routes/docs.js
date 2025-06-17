const express = require('express');
const prisma = require('../lib/prisma');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Get documentation metadata for PDF export
router.get('/metadata/:systemId', isAuthenticated, async (req, res) => {
  try {
    const system = await prisma.designSystem.findFirst({
      where: { 
        id: req.params.systemId,
        userId: req.user.id 
      },
      include: {
        foundations: {
          include: {
            tokens: true
          }
        },
        components: true
      }
    });
    
    if (!system) {
      return res.status(404).json({ error: 'Design system not found' });
    }
    
    // Generate comprehensive documentation data
    const documentationData = {
      system: {
        name: system.name,
        description: system.description || 'A comprehensive design system for consistent digital experiences',
        created: system.createdAt,
        updated: system.updatedAt
      },
      colorPalette: system.foundations
        ?.find(f => f.category === 'colors')
        ?.tokens?.map(token => ({
          name: token.name,
          hex: token.value,
          usage: token.description || 'Design system color'
        })) || [
        { name: 'Primary', hex: '#3B82F6', usage: 'Main brand color, buttons, links' },
        { name: 'Secondary', hex: '#64748B', usage: 'Text, borders, subtle elements' },
        { name: 'Success', hex: '#10B981', usage: 'Success messages, confirmations' },
        { name: 'Warning', hex: '#F59E0B', usage: 'Warnings, cautions' },
        { name: 'Error', hex: '#EF4444', usage: 'Errors, destructive actions' }
      ],
      typography: system.foundations
        ?.find(f => f.category === 'typography')
        ?.tokens?.map(token => ({
          name: token.name,
          size: token.value,
          weight: token.properties?.weight || '400',
          usage: token.description || 'Typography style'
        })) || [
        { name: 'Heading 1', size: '2.25rem', weight: '800', usage: 'Page titles' },
        { name: 'Heading 2', size: '1.875rem', weight: '700', usage: 'Section headers' },
        { name: 'Heading 3', size: '1.5rem', weight: '600', usage: 'Subsection headers' },
        { name: 'Body Large', size: '1.125rem', weight: '400', usage: 'Large body text' },
        { name: 'Body', size: '1rem', weight: '400', usage: 'Default body text' },
        { name: 'Caption', size: '0.875rem', weight: '400', usage: 'Small text, captions' }
      ],
      components: system.components?.map(component => ({
        name: component.name,
        description: component.description || 'Reusable component',
        variants: component.variants || ['Default'],
        props: component.props || [],
        examples: component.examples || []
      })) || [
        { name: 'Button', description: 'Interactive elements for user actions', variants: ['Primary', 'Secondary', 'Ghost'] },
        { name: 'Card', description: 'Container for grouping related content', variants: ['Default', 'Elevated'] },
        { name: 'Input Field', description: 'Form elements for user input', variants: ['Text', 'Email', 'Password'] }
      ]
    };
    
    res.json({ documentation: documentationData });
  } catch (error) {
    console.error('Error fetching documentation metadata:', error);
    res.status(500).json({ error: 'Failed to fetch documentation metadata' });
  }
});

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
