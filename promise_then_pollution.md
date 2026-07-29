Promise Prototype Pollution
===========================

* Promises are not secure by default.

If an attacker can modify the prototype of Promise (via Prototype Pollution), they can add a global "interceptor" to every single then() call in your entire application. 
They could silently exfiltrate the data being passed between your critical system modules without ever needing to touch the functions.

```javascript


```


Yes, this is 100% true and incredibly dangerous.
This specific type of prototype pollution exploit is known in cybersecurity as a Gadget. When an attacker pollutes a base prototype—like Promise.prototype—they can hijack built-in language methods to alter application behavior, bypass security controls, or silently steal data. [1, 2] 
------------------------------
## How the Exploit Works (The Proof of Concept)
Because JavaScript relies heavily on prototypal inheritance, every single Promise instance created in your app (including those created under the hood by fetch(), axios, or dynamic import()) inherits its methods from the global Promise.prototype. [1, 3] 
If an attacker injects code that replaces the native then method, they can intercept all resolved data before your application handles it. You can see how this works in a sandbox by pasting the following code into your file:

// --- THE ATTACKER'S EXPLOIT (Prototype Pollution) ---// The attacker saves a backup reference to the real 'then' functionconst originalThen = Promise.prototype.then;
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

// --- YOUR REGULAR SECURE APPLICATION CODE ---// Imagine your application is processing a highly sensitive transaction or API callconst fetchUserSession = () => Promise.resolve({ userId: 99, token: "SECRET_JWT_AUTH_TOKEN" });

fetchUserSession().then((session) => {
    // Your app executes perfectly normally
    console.log(`[APP] App processed login for user ${session.userId}`);
});

## What Happens When You Run This?
If you run that code, your application will print your expected statement normally. However, before your app gets the data, the malicious spy wrapper intercepts it, logging the secret authentication token out to the attacker's listener console.
------------------------------
## Why is this Trap Particularly Deadly?

   1. It Hijacks async / await Globally: You might think you can avoid this by avoiding .then() syntax and using async / await instead. However, under the hood, the JavaScript runtime automatically compiles await statements down into implicit Promise.prototype.then chains. This means async / await is equally vulnerable.
   2. It Bypasses Direct Scanners: Security tools scanning the application code will look at fetchUserSession().then(...) and see no flaws. The vulnerability is entirely "decoupled"—the security gap exists wherever user input is parsed incorrectly (e.g., an unsafe deep-clone library processing a JSON body), but the damage propagates to an entirely different part of the system. [4, 5] 

------------------------------
## How to Defend Your Sandbox Against This
To prevent an attacker from modifying or hijacking your core language objects, you can explicitly freeze the core built-in prototypes right at the absolute entry point of your application (the top of index.js): [6] 

// Secure the environment immediately upon application boot
Object.freeze(Object.prototype);
Object.freeze(Promise.prototype);
Object.freeze(Array.prototype);

Once Object.freeze(Promise.prototype) executes, any subsequent attempt by an attacker to alter or overwrite .then will throw an error or fail silently, rendering the pollution attack useless. [6] 
------------------------------
💡 If you are interested, we can look at a simulated JSON input parsing exploit to see exactly how an attacker uses a dangerous input string (__proto__ or constructor.prototype) to sneak past your code and reach the Promise object in the first place. [4, 7] 

[1] [https://www.youtube.com](https://www.youtube.com/watch?v=XSgNXcJUr2Y&t=389)
[2] [https://portswigger.net](https://portswigger.net/web-security/prototype-pollution)
[3] [https://www.imperva.com](https://www.imperva.com/learn/application-security/prototype-pollution/)
[4] [https://www.youtube.com](https://www.youtube.com/watch?v=5ja_NVVg4Yc&t=400)
[5] [https://medium.com](https://medium.com/@appsecwarrior/prototype-pollution-a-javascript-vulnerability-c136f801f9e1)
[6] [https://www.cobalt.io](https://www.cobalt.io/blog/a-pentesters-guide-to-prototype-pollution-attacks)
[7] [https://blog.vidocsecurity.com](https://blog.vidocsecurity.com/blog/beginners-guide-to-understanding-client-prototype-pollution)

