import passport from "passport"
import local from "passport-local"
import passportJWT from "passport-jwt"
import fs from "fs"
import bcrypt from "bcrypt"
import { userService } from "../repository/UserRepository.js"

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
                    let usuario = await userService.getUserByEmail(username)
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
                    let { first_name, last_name, age, role } = req.body
                    if (!first_name || !last_name || !age) return done(null, false)

                    let usuario = await userService.getUserByEmail(username)

                    if (usuario) {
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

                    const newUser = await userService.createUser(usuario)

                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}