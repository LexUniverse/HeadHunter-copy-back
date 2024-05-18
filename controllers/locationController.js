const { Location, Vacancy } = require('../models/models');
const ApiError = require('../error/ApiError');

class LocationController {
    async create(req, res) {
        const { region, city } = req.body;
        const location = await Location.create({ region, city });
        return res.json(location);
    }

    async getAll(req, res) {
        const locations = await Location.findAll();
        return res.json(locations);
    }

    async delete(req, res, next) {
        const { id, region, city } = req.query;
        let deletedRowCount;

        try {
            if (id) {
                deletedRowCount = await Location.destroy({
                    where: { id }
                });
            } else if (region && city) {
                deletedRowCount = await Location.destroy({
                    where: { region, city }
                });
            } else {
                return next(ApiError.badRequset('Не указаны параметры для удаления'));
            }

            if (deletedRowCount > 0) {
                return res.json({ message: 'Запись успешно удалена' });
            } else {
                return next(ApiError.badRequset('Запись не найдена'));
            }
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении записи'));
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { region, city } = req.body;

        try {
            const location = await Location.findByPk(id);

            if (!location) {
                return next(ApiError.badRequset('Запись не найдена'));
            }

            // Обновление записи
            location.region = region;
            location.city = city;
            await location.save();

            return res.json(location);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении записи'));
        }
    }


}

module.exports = new LocationController();
