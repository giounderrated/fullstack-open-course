const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type:String,
    required:true,
    minLength: 3,
    unique:true
  },
  passwordHash: {
    type:String,
    required:true,
    minLength: 3,
  }
  // notes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Note'
  //   }
  // ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User