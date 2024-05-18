const Router = require('express')
const router = new Router()
const vacancyController = require('../controllers/vacancyController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');


router.post('/', checkRoleMiddleware(['EMPLOYER', 'ADMIN']), vacancyController.create)
router.get('/', vacancyController.getAll)
router.get('/:id', vacancyController.getOne)
router.delete('/:id', checkRoleMiddleware(['ADMIN']), vacancyController.delete)
router.put('/:id', checkRoleMiddleware(['ADMIN']), vacancyController.update)

module.exports = router
