let mongoose=require('mongoose');
let passportlocalmongoose=require('passport-local-mongoose');

let userSchema= new mongoose.Schema({
    username: {
        type: String,
        default:'',
        trim:true,
        required:"username is required"
    },
    email: {
        type:String,
        default:'',
        trim:true,
        required:'Email is required'
    },
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Dispaly Name is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
},
{
    collection: "users"
}
);

let options = ({
    missingPasswordError: "Wrong Password"
});

userSchema.plugin(passportlocalmongoose, options);

module.exports.User = mongoose.model('User', userSchema);
