const Router = require('express')
const router = new Router()
const employmentTypeController = require('../controllers/employmentTypeController')
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/', checkRole(['ADMIN']), employmentTypeController.create)
router.get('/', employmentTypeController.getAll)
router.delete('/:id', checkRole(['ADMIN']), employmentTypeController.delete)
router.put('/:id', checkRole(['ADMIN']), employmentTypeController.update);

module.exports = router