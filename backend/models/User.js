const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {name:String, require: true},
        email:{name:String, require: true, unique:true},
        password:{name:String, require: true},
        profileImgUrl:{type:String , default: null},
        role: {type: String, enum: ["admin","member"], default:"member"},
    },
    {timestamps: true}
);

module.exports = mongoose.model("user", UserSchema);