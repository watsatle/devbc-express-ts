import { RequestHandler } from "express";
import z from "zod";

export const mySchema = z.object({
	name: z.string(),
	email: z.string(),
	address: z.string(),
});
export type mySchema = z.infer<typeof mySchema>;

export const schemaValidation: RequestHandler = (req, res, next) => {
	const validateReqBody = mySchema.safeParse(req.body);

	if (!validateReqBody.success) {
		return res.status(400).json({ error: validateReqBody.error });
	}
	next();
};

// function errorHandler (err, req, res, next) {
//     if (res.headersSent) {
//       return next(err)
//     }
//     res.status(500)
//     res.render('error', { error: err })
//   }
//   app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })
