const roleMiddleware = (allowedRoles) => {   //takes the array as input to verify the roles 
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });  //no token has so unauthorized
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access Denied" });
        }

        next(); // User has the required role, proceed to route
    };
};

module.exports = roleMiddleware;
