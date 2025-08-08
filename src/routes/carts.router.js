import express from "express"
import cartController from '../controllers/cartsController.js';
import passport from 'passport';
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.createCart);
router.get("/:cid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.getCartProducts);
router.post("/:cid/products/:pid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.addProductToCart);
router.delete("/:cid/products/:pid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.removeProductFromCart);
router.put("/:cid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.updateProductsInCart);
router.put("/:cid/products/:pid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.updateProductQuantityInCart);
router.delete("/:cid", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.emptyCart);
router.post("/:cid/purchase", passport.authenticate("current", {session:false, failureRedirect:"/error"}), auth(["user", "admin"]), cartController.purchaseCart);

export default router;