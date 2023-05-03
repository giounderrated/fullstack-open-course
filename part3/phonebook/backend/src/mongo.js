const mongoose = require("mongoose");

const args = process.argv;

if (args.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://devjaeger:${password}@fullstack-open.2gsqkbu.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
})

const Person = mongoose.model("Person", personSchema);

const create = (name, number) => {
  const person = new Person({ name, number });

  person.save().then((result) => {
    console.log(
      "Added",
      result.name,
      "with the number",
      result.number,
      "to the phonebook"
    );
    mongoose.connection.close();
  });
};

const getAll = () => {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(person.name,"", person.number);
    });
    mongoose.connection.close();
  });
};

if (args.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];
  create(name, number);
} else {
  getAll();
}
