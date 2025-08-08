export const auth=(permissions=[])=>{
    return (req, res, next)=>{
        permissions=permissions.map(p => p.toLowerCase())

        if(!permissions.includes(req.user.role.toLowerCase())){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No tiene permisos para acceder a este recurso`})
        }

        next()
    }
}