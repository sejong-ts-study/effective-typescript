namespace Item6 {
  interface Person {
    name: string;
    age: number;
  }

  const person: Person = {
    name: "Jane",
    age: 20,
  };

  console.log(person.name);

  const getNames = (people: Person[]) => {
    return people.map((person) => person.name);
  };
}
