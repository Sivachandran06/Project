const multer = require("multer");

//Configure store
const storage = multer.diskStorage({
    destination: (req, res, cb)=>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    },
});

//File filter
const fileFilter = (req, file, cb)=>{
    const allowedType = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowedType.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error('only .jpeg .png and .jpg formates are allowed'), false);
    }
};

const upload = multer({storage, fileFilter});


module.exports = upload;