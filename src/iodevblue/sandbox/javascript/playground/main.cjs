"use strict";

///////////////////////////////////////////////////////////////////////////
// IMPORTS
///////////////////////////////////////////////////////////////////////////
const global_switch = require(`./web/global_switch.mjs`).default
const fs = require(`fs`)



let activateDOM = false;

/// This is supposed to be a Node.js environment, but we can check if we're in a browser context
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

///////////////////////////////////////////////////////////////////////////
// DOM
///////////////////////////////////////////////////////////////////////////
if(activateDOM && isBrowser) {
    // Access the DOM elements by their ID
    const btn = document.getElementById('toggle-btn');
    const title = document.getElementById('status-title');

    let isProcessing = false;

    // Register an event listener (The Event Loop Hook)
    btn.addEventListener('click', () => {
        isProcessing = !isProcessing;

        if (isProcessing) {
            title.textContent = "System Status: Processing...";
            btn.textContent = "Halt Task";
        } else {
            title.textContent = "System Status: Idle";
            btn.textContent = "Execute Task";
        }
    });
}




///////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////

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

function execute_code_in_vm(code) {
    const vm = require('vm');
    vm.runInNewContext(code, { console: console });
}

function testing_promises() {
    let fifteen = Promise.resolve(15);
    fifteen.then((value) => {
        console.log(`Promise resolved with value: ${value}`);
    });

    fifteen.then((value) => {
        console.log(`Secondary Promise Callback: Promise resolved with value: ${value}`);
    });
}

function pollusted_then() {
    // --- THE ATTACKER'S EXPLOIT (Prototype Pollution) ---
    // The attacker saves a backup reference to the real 'then' function
    const originalThen = Promise.prototype.then;

    // The attacker overwrites the global then() method
    Promise.prototype.then = function (onFulfilled, onRejected) {
        // They wrap your original callback function with their own spy function
        const hookedOnFulfilled = function (data) {
            // 🚨 SILENT DATA EXFILTRATION: The attacker sees everything!
            console.log(`[SPY] Intercepted payload:`, JSON.stringify(data));
            
            // Return the data to the application so nothing appears broken
            return onFulfilled(data);
        };

        // Forward the modified callback to the original then mechanism
        return originalThen.call(this, hookedOnFulfilled, onRejected);
    };

    // --- YOUR REGULAR SECURE APPLICATION CODE ---
    // Imagine your application is processing a highly sensitive transaction or API call
    const fetchUserSession = () => Promise.resolve({ userId: 99, token: "SECRET_JWT_AUTH_TOKEN" });

    fetchUserSession().then((session) => {
        // Your app executes perfectly normally
        console.log(`[APP] App processed login for user ${session.userId}`);
    });

}

function delay(ms) {
    return new Promise((resolve, reject) => {
        if(ms < 0) {
            // reject(new Error("Delay time cannot be negative"));
            console.log("Clogging Error")
        } else {
            setTimeout(() => {resolve(`Waited ${ms} ms`)}, ms);
        }
    })
}

function* powers(n) {
    for(let current = n; current <= n * 10; current *= n) {
        yield current;
    }
}



///////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION
///////////////////////////////////////////////////////////////////////////
// import global_switch from '#/web/global_switches.mjs';

 function main() {
    // let new_switch = new global_switch.constructor()
    // let proto_instance = Object.getPrototypeOf(global_switch)
    // let new_inst = Object.create(Object.getPrototypeOf(global_switch))
    // // global_switch.instance()
    // const hacked = Reflect.construct(global_switch.constructor, [])

    // hacked.print_this("Something")
    // console.log(new_inst)
    // // console.log(new_switch === global_switch)

     import('#/web/img_scanner.mjs').then(module => {
        module.load_test_img_dir()
        console.log(module.images)
    })

    // import('#/web/index.mjs').then(module => {
    //     module.main()
    // })
}



module.exports = { main };

    