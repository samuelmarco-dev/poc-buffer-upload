import express, { json } from "express";
import morgan from "morgan";
import multer from "multer";
import crypto from "crypto";

const app = express();

app.use(json());
app.use(morgan('dev'));

const upload = multer({ 
	dest: "uploads/",
	storage: multer.diskStorage({
		destination: (req, file, callback)=> {
			callback(null, "uploads/");
		},
		filename: (req, file, callback)=> {
			crypto.randomBytes(16, (err, hash)=> {
				if(err) callback(err);
				const filename = `${hash.toString("hex")}-${file.originalname}`;
				callback(null, filename);
			})
		}
	}),
	limits: {
		fileSize: 5 * 1024 * 1024
	},
	fileFilter: (req, file, callback) => {
		const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml"];
		if (tiposPermitidos.indexOf(file.mimetype) === -1) {
			callback(new Error("Tipo de arquivo não permitido"));
		}else{
			callback(null, true);
		}
	} 
});

app.post("/upload_files", upload.array("files"), uploadFiles); //upload.single("files")

function uploadFiles(req, res) {
	console.log(req.body, req.files);
	res.json({ message: "Successfully uploaded files" });
}

app.listen(5000, () => {
	console.log(`Server started...`);
});
