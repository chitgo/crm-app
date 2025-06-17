const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: { userId: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                company: true,
                createdAt: true,
                leads: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        createdAt: true,
                        followUpDate: true,
                        notes: true,
                    },
                },
            },
        });
        res.json({ message: 'Customers retrieved successfully', customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createCustomer = async (req, res) => {
    const { name, email, phone, company } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                company,
                userId: req.user.userId,
            },
        });
        res.status(201).json({ message: 'Customer created successfully', customer });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const existingCustomer = await prisma.customer.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.userId,
            },
        });

        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: { name, email, phone, company },
        });

        res.json({ message: 'Customer updated successfully', customer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const existingCustomer = await prisma.customer.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.userId,
            },
        });

        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        await prisma.customer.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
