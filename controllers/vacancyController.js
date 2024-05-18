const { Vacancy, VacancyInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class VacancyController {
    async create(req, res, next) {
        try {
            let { job_title, company, salary, locationId, employmentTypeId, info } = req.body;

            console.log('sjob_title:', job_title);
            console.log('scompany:', company);
            console.log('ssalary:', salary);

            if (!job_title || !company || !salary) {
                return next(ApiError.badRequset('Не заполнены обязательные поля: job_title, company, salary'));
            }

            const vacancy = await Vacancy.create({ job_title, company, salary, locationId, employmentTypeId });

            if (info) {
                info = JSON.parse(info);
                for (const i of info) {
                    await VacancyInfo.create({
                        title: i.title,
                        description: i.description,
                        vacancyId: vacancy.id
                    });
                }
            }

            return res.json(vacancy);
        } catch (e) {
            next(ApiError.internal('Ошибка при создании вакансии: ' + e.message));
        }
    }

    async getAll(req, res, next) {
        let { employmentTypeId, locationId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 5;
        let vacancies;
        let offset = page * limit - limit;
        try {
            if (!locationId && !employmentTypeId) {
                vacancies = await Vacancy.findAndCountAll({ limit, offset });
            } else if (locationId && !employmentTypeId) {
                vacancies = await Vacancy.findAndCountAll({ where: { locationId }, limit, offset });
            } else if (!locationId && employmentTypeId) {
                vacancies = await Vacancy.findAndCountAll({ where: { employmentTypeId }, limit, offset });
            } else {
                vacancies = await Vacancy.findAndCountAll({ where: { employmentTypeId, locationId }, limit, offset });
            }
            return res.json(vacancies);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении вакансий'));
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const vacancy = await Vacancy.findOne({
                where: { id },
                include: [{ model: VacancyInfo, as: 'info' }]
            });
            return res.json(vacancy);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении вакансии'));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const deletedRowCount = await Vacancy.destroy({ where: { id } });
            if (deletedRowCount > 0) {
                return res.json({ message: 'Вакансия успешно удалена' });
            } else {
                return next(ApiError.badRequset('Вакансия не найдена'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при удалении вакансии'));
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { job_title, company, salary, locationId, employmentTypeId } = req.body;
        try {
            const vacancy = await Vacancy.findByPk(id);
            if (!vacancy) {
                return next(ApiError.badRequset('Вакансия не найдена'));
            }
            vacancy.job_title = job_title;
            vacancy.company = company;
            vacancy.salary = salary;
            vacancy.locationId = locationId;
            vacancy.employmentTypeId = employmentTypeId;
            await vacancy.save();
            return res.json(vacancy);
        } catch (error) {
            next(ApiError.internal('Ошибка при обновлении вакансии'));
        }
    }
}

module.exports = new VacancyController();
