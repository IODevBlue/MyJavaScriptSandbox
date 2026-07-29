"use strict";

// transform("Something", (item) => console.log(item))
function transform(item, callback) {
    callback(typeof item == "string" ? item.length : 0)
}

// doubleStep((item) => console.log(item)) ("This is for double step")
function doubleStep(func) {
    return (something) => {func(something)}
}

let prototype = {
    name: "Primordial",
    age: 0,
    species: "Undefined",
    isAlive() {
        return this.age > 0;
    },
    speak(words) {
        console.log(`${this.name} says: ${words}`);
    }
}

class Student {
    constructor(name, age, year) {
        this.name = name
        this.age = age
        this.year = year
    }

    scream_exec() {
        let stud = new Student("John Doe", 20, 2026)
        Student.prototype.scream = function() {
            console.log(`${this.name} is screaming ARRGGGGHHHH`)
        }
        stud.scream()

        let symbol = Symbol("scream_louder")
        Student.prototype[symbol] = function() {
            console.log(`${this.name} is screaming louder AAAARRRRRRRGGGGGGGGHHHHHHHH`)
        }
        stud[symbol]()

        console.log(symbol.description)
    }

    toJson() {
        return JSON.stringify(this)
    }
}

class UniversityStudent extends Student {
    constructor(name, age, year, university) {
        super(name, age, year)
        this.university = university
    }

    verify_instance_of() {
        let uniStudent = new UniversityStudent("Alice", 21, 2025, "MIT")
        console.log(uniStudent instanceof Student)
    }
}

// something = 79

function main() {
    const vm = require('vm');
    vm.runInNewContext('console.log("Hello")', { console: console });
}

module.exports = { main };

    