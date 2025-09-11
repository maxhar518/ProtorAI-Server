const authorizedRole = (...allowedRoles) => {
    try {
        return (req, res, next) => {
            console.log(req.user.role[0])
            if (!allowedRoles.includes(req.user.role[0])) {
                return res.status(403).json({ message: "Access denied" })
            }
            next()
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
        next()
    }
}

module.exports = authorizedRole