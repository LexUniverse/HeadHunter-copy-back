const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const List = sequelize.define('list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const ListVacancy = sequelize.define('list_vacancy', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Vacancy = sequelize.define('vacancy', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    job_title: {type: DataTypes.STRING, allowNull: false},
    company: {type: DataTypes.STRING, allowNull: false},
    salary: {type: DataTypes.INTEGER, allowNull: false},
})

const EmploymentType = sequelize.define('employment_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Location = sequelize.define('location', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    region: {type: DataTypes.STRING, allowNull: false},
    city: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const VacancyInfo = sequelize.define('vacancy_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const EmploymentTypeLocation = sequelize.define('type_Location', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


User.hasOne(List)
List.belongsTo(User)

List.hasMany(ListVacancy)
ListVacancy.belongsTo(List)

ListVacancy.belongsTo(Vacancy)
Vacancy.hasMany(ListVacancy)

Vacancy.belongsTo(EmploymentType)
EmploymentType.hasMany(Vacancy)

Vacancy.belongsTo(Location)
Location.hasMany(Vacancy)

Vacancy.hasMany(VacancyInfo, {as: 'info'});
VacancyInfo.belongsTo(Vacancy)

EmploymentType.belongsToMany(Location, {through: EmploymentTypeLocation })
Location.belongsToMany(EmploymentType, {through: EmploymentTypeLocation })

module.exports = {
    User,
    List,
    ListVacancy,
    Vacancy,
    EmploymentType,
    Location,
    EmploymentTypeLocation,
    VacancyInfo
}