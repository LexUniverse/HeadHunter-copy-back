const {List, ListVacancy, Vacancy, VacancyInfo} = require('../models/models');
const jwt = require('jsonwebtoken');
const {Op} = require("sequelize");
const ApiError = require('../error/ApiError');

class ListController {

    async add(req, res, next) {
        try {
            const {vacancyId} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);
            const userList = await List.findOne({where: {userId: user.id}});

            if (!userList) {
                return next(ApiError.badRequset('Список не найден'));
            }

            const listId = userList.id;

            // Проверяем, существует ли уже запись с таким vacancyId в списке пользователя
            const existingRecord = await ListVacancy.findOne({where: {listId, vacancyId}});
            if (existingRecord) {
                return next(ApiError.badRequset('Эта вакансия уже добавлена в ваш список'));
            }

            // Если запись не существует, добавляем вакансию в список
            const newRecord = await ListVacancy.create({listId, vacancyId});

            if (!newRecord) {
                return next(ApiError.internal('Ошибка при создании записи в БД'));
            }

            return res.json("Вакансия добавлена в ваш список");
        } catch (error) {
            next(ApiError.internal('Ошибка при добавлении вакансии в список'));
        }
    }


    async getAll(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);

            // Находим пользователя и получаем его listId
            const userList = await List.findOne({where: {userId: user.id}});
            const listId = userList ? userList.id : null;

            if (!listId) {
                return next(ApiError.badRequset('Список не найден'));
            }

            // Находим все записи в ListVacancy с данным listId
            const listVacancies = await ListVacancy.findAll({where: {listId}});

            const vacancyIds = listVacancies.map(item => {

                return item.vacancyId;
            });


            // Находим все вакансии, связанные с найденными идентификаторами
            const vacancies = await Vacancy.findAll({where: {id: vacancyIds}});


            return res.json(vacancies);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении списка вакансий'));
        }
    }


    async delete(req, res, next) {
        try {
            const { vacancyId } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);

            // Находим пользователя и получаем его listId
            const userList = await List.findOne({where: {userId: user.id}});
            console.log(user.id)
            console.log(vacancyId)
            // Проверка, был ли найден список пользователя
            if (!userList) {
                return res.status(404).json('Список не найден');
            }

            // Проверка, соответствует ли пользователь списку
            if (userList.userId !== user.id) {
                return res.status(403).json('Нет доступа для удаления вакансии из списка');
            }

            // Выполнение операции удаления вакансии из списка
            const deletedRowCount = await ListVacancy.destroy({ where: { listId: userList.id, vacancyId: vacancyId } });

            // Проверка, была ли удалена запись
            if (deletedRowCount === 0) {
                return res.status(404).json('Вакансия не найдена в вашем списке');
            }

            // Возвращаем ответ об успешном удалении
            return res.json('Вакансия удалена из вашего списка');
        } catch (error) {
            // Обработка ошибок
            next(ApiError.internal('Ошибка при удалении вакансии из списка'));
        }
    }
}

module.exports = new ListController();
