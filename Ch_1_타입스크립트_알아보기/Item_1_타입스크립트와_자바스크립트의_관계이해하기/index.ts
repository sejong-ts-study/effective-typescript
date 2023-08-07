type SayHello = (name: string) => void;

const sayHello: SayHello = (name) => {
  console.log(`Hello ${name.toUppercase()}`);
};
