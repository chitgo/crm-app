const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];

const getLeads = async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            where: { userId: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                followUpDate: true,
                notes: true,
                createdAt: true,
                updatedAt: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.json({ leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
};

const getLeadCount = async (req, res) => {
    try {
        const count = await prisma.lead.count({
            where: { userId: req.user.userId },
        });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching lead count:', error);
        res.status(500).json({ error: 'Failed to fetch lead count' });
    }
};

const createLead = async (req, res) => {
    const { name, email, phone, status, customerId, followUpDate, notes } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (status && !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    if (customerId) {
        const customer = await prisma.customer.findFirst({
            where: { id: parseInt(customerId), userId: req.user.userId },
        });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
    }

    try {
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                status: status ? status.toUpperCase() : 'NEW',
                userId: req.user.userId,
                customerId: customerId ? parseInt(customerId) : null,
                followUpDate: followUpDate ? new Date(followUpDate) : null,
                notes,
            },
        });
        res.status(201).json({ lead });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
};

const updateLead = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, status, customerId, followUpDate, notes } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (status && !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    if (customerId) {
        const customer = await prisma.customer.findFirst({
            where: { id: parseInt(customerId), userId: req.user.userId },
        });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
    }

    try {
        const lead = await prisma.lead.update({
            where: { id: parseInt(id), userId: req.user.userId },
            data: {
                name,
                email,
                phone,
                status: status ? status.toUpperCase() : undefined,
                customerId: customerId ? parseInt(customerId) : null,
                followUpDate: followUpDate ? new Date(followUpDate) : null,
                notes,
            },
        });
        res.json({ lead });
    } catch (error) {
        console.error('Error updating lead:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Lead not found' });
        } else {
            res.status(500).json({ error: 'Failed to update lead' });
        }
    }
};

const deleteLead = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.lead.delete({
            where: { id: parseInt(id), userId: req.user.userId },
        });
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting lead:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Lead not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete lead' });
        }
    }
};

module.exports = { getLeads, getLeadCount, createLead, updateLead, deleteLead };
