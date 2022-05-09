class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    getInfo() {
        return this.name + ':' + this.age;
    }
}
xx = new Person("zzzz", "yyy")
console.log(xx.name)
console.log(xx.age)