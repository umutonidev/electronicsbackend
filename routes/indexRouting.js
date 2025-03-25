import userRoute from "./userRoutes.js"
import orderRoute from "./orderRoutes.js"
import paymentRoute from "./paymentRoutes.js"
import productRoute from "./productRoutes.js"
import express from "express"
const route =express()

route.use("/user",userRoute)
route.use("/order",orderRoute)
route.use("/payment",paymentRoute)
route.use("product",productRoute)

export default route;
