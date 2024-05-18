const { Location, EmploymentType } = require("../models/models");
const ApiError = require("../error/ApiError");

class EmploymentTypeController {
    async create(req, res, next) {
        const { name } = req.body;
        try {
            const employmentType = await EmploymentType.create({ name });
            return res.json(employmentType);
        } catch (error) {
            return next(ApiError.internal("Ошибка при создании типа занятости"));
        }
    }

    async getAll(req, res, next) {
        try {
            const employmentTypes = await EmploymentType.findAll();
            return res.json(employmentTypes);
        } catch (error) {
            return next(ApiError.internal("Ошибка при получении всех типов занятости"));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const deletedRowCount = await EmploymentType.destroy({ where: { id } });
            if (deletedRowCount > 0) {
                return res.json({ message: "Тип занятости успешно удален" });
            } else {
                return next(ApiError.badRequset("Тип занятости не найден"));
            }
        } catch (error) {
            return next(ApiError.internal("Ошибка при удалении типа занятости"));
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const employmentType = await EmploymentType.findByPk(id);
            if (!employmentType) {
                return next(ApiError.badRequset("Тип занятости не найден"));
            }
            employmentType.name = name;
            await employmentType.save();
            return res.json(employmentType);
        } catch (error) {
            return next(ApiError.internal("Ошибка при обновлении типа занятости"));
        }
    }
}

module.exports = new EmploymentTypeController();
