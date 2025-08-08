import express from "express";
import productsController from '../controllers/productsController.js';
import passport from 'passport';
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), productsController.getProductsPaginated);
router.get("/:pid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), productsController.getProductById);
router.post("/", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["admin"]), productsController.createProduct);
router.put("/:pid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["admin"]), productsController.updateProduct);
router.delete("/:pid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["admin"]), productsController.deleteProduct);

export default router;