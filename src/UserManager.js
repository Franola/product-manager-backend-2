import { UserModel } from "./models/user.model.js";

class UserManager {

    async obtenerUsuarios() {
        try {
            const users = await UserModel.find().lean();

            return users;
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            return [];
        }
    }

    async obtenerUsuarioPorEmail(email) {
        try {
            const user = await UserModel.findOne({ email }).lean();
            console.log("Usuario encontrado:", user);
            if (!user) {
                console.error("Usuario no encontrado");
                return null;
            }
            return user;
        } catch (error) {
            console.error("Error al obtener el usuario por email:", error);
            return null;
        }   
    }

    async agregarUsuario(ususario) {
        try {
            const newUser = await UserModel.create(ususario);

            return newUser;
        } catch (error) {
            console.error("Error al agregar el ususario:", error);
        }
    }

    async actualizarUsuario(email, usuarioActualizado) {
        try {
            const updatedUser = await UserModel.findOneAndUpdate({email}, usuarioActualizado, { new: true, runValidators: true }).lean();

            if (!updatedUser) {
                console.error("Usuario no encontrado");
                return null;
            }
            return updatedUser;
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    }

    async eliminarUsuario(email) {
        try {
            const deletedUser = await UserModel.findOneAndDele({email}).lean();
            if (!deletedUser) {
                console.error("Usuario no encontrado");
                return null;
            }
            return deletedUser;
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    }
}

export default UserManager;