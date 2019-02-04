const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const expenseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

router.get('/all/:id', async (req, res) => {
    try {
        const expense = await Expense.find({ id: req.params.id });
        res.send(expense);
    } catch (e) {
        res.send(e);
    }
});

router.post('/create', async (req, res) => {
    const { error } = validateExpense(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const expense = new Expense({
        id: req.body.id,
        description: req.body.description,
        type: req.body.type,
        amount: req.body.amount,
        createdAt: req.body.createdAt
    });
    try {
        const result = await expense.save();
        res.send(result);
    } catch (e) {
        res.send(e);
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const result = await Expense.findById(req.params.id);
        if (!result) {
            console.log('asdsad');
            res.status(404).send(`Expense not found`);
        }
        const { error } = validateExpense(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        const expense = await Expense.findByIdAndUpdate(req.params.id, {
            id: req.body.id,
            description: req.body.description,
            type: req.body.type,
            amount: req.body.amount,
            createdAt: req.body.createdAt
        }, { new: true });
        if (!expense) {
            res.status(400).send('Something went wrong');
            return;
        }
        res.send(expense);
    } catch (e) {
        res.send(e);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await Expense.findByIdAndDelete(req.params.id);
        if (!result) {
            console.log('asdsad');
            res.status(404).send(`Expense not found`);
        }
        res.send(`Expense deleted`);
    } catch (e) {
        res.send(e);
    }
});

function validateExpense(expense) {
    const schema = {
        id: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(5).max(100).required(),
        type: Joi.string().required(),
        amount: Joi.string().required(),
        createdAt: Joi.string().required()
    }
    const result = Joi.validate(expense, schema);
    return result;
}

module.exports.expense = router;