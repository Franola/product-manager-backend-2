import passport from "passport"
import local from "passport-local"
import passportJWT from "passport-jwt"
import fs from "fs"
import bcrypt from "bcrypt"
import UserManager from "../UserManager.js"

const userManager = new UserManager();

const buscarToken = req => {
    let token = null

    if (req.cookies.cookieToken) token = req.cookies.cookieToken

    return token
}

export const iniciarPassport = () => {

    passport.use("current",
        new passportJWT.Strategy(
            {
                secretOrKey: "Fciarallo22",
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async (contenidoToken, done) => {
                try {
                    console.log("Contenido del token:", contenidoToken);
                    return done(null, contenidoToken)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    let usuario = await userManager.obtenerUsuarioPorEmail(username)
                    if (!usuario) { 
                        return done(null, false)
                    }

                    if (!bcrypt.compareSync(password, usuario.password)) { 
                        return done(null, false)
                    }

                    return done(null, usuario)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("register",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    console.log("Datos de registro:", req.body);
                    let { first_name, last_name, age, role } = req.body
                    if (!first_name || !last_name || !age) return done(null, false)
                    
                    console.log("Username:", username);
                    let usuario = await userManager.obtenerUsuarioPorEmail(username)
                    console.log("Usuario encontrado:", usuario);
                    if (usuario) {
                        console.log("Usuario ya existe:", usuario);
                        return done(null, false)
                    }
                    usuario = {
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: bcrypt.hashSync(password, 10),
                        rol: role || "user"
                    }

                    const newUser = await userManager.agregarUsuario(usuario)

                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}