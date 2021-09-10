const { request } = require("express")


const isAdminRol = (req = request, res = reponse, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'User problema'
        })
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es administrador`
        })
    }
    next();

}

const isRolesValid = (...roles) => {

    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'User problema'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `El role no es permitido ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    isAdminRol,
    isRolesValid
}