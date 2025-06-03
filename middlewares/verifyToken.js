import jwt from 'jsonwebtoken';

const verifyToken = async(req, res, next) => {
    const authHeader = await req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.isBlocked) {
        return res.status(403).json({ message: 'User is blocked' });
    }
    if (req.user.isDeleted) {
        return res.status(403).json({ message: 'User is deleted' });
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Admin' 
            || req.user.userType === 'Client' 
            || req.user.userType === 'Vendor' 
            || req.user.userType === 'Driver') 
            {
            next();
        } else {
            return res.status(403).json({ message: 'You are not allowed to do that!' });
        }
    });
}

const verifyVendorToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Admin' 
            || req.user.userType === 'Vendor') 
            {
            next();
        } else {
            return res.status(403).json({ message: 'You are not allowed to do that!' });
        }
    });
}

const verifyAdminToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Admin' ) 
            {
            next();
        } else {
            return res.status(403).json({ message: 'You are not allowed to do that!' });
        }
    });
}

const verifyDriver = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Driver') 
            {
            next();
        } else {
            return res.status(403).json({ message: 'You are not allowed to do that!' });
        }
    });
}

export {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyVendorToken,
    verifyAdminToken,
    verifyDriver,
};

