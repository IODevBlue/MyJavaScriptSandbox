Promise Prototype Pollution
===========================

* Promises are not secure by default.

If an attacker can modify the prototype of `Promise` (via Prototype Pollution), they can add a global "interceptor" to every single `then()` call in your entire application.
They could silently exfiltrate the data being passed between your critical system modules without ever needing to touch the functions.

## How the exploit works (The Proof of Concept)
Because JavaScript relies heavily on prototype inheritance, every single `Promise` instance created in your app (including those created under the hood by `fetch()`, `Axios`, or dynamic `import()`) inherits its methods from the global `Promise`.prototype.

If an attacker injects code that replaces the native `then` method, they can intercept all resolved data before your application handles it.

```javascript
        // --- THE ATTACKER'S EXPLOIT (Prototype Pollution) ---

// The attacker saves a backup reference to the real 'then' 
function const originalThen = Promise.prototype.then;

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

```

## What happens when you run this?
If you run that code, your application will print your expected statement normally. However, before your app gets the data, the malicious spy wrapper intercepts it, logging the secret authentication token out to the attacker's listener console.

## Why is this trap particularly deadly?

   1. It Hijacks `async` / `await` Globally: You might think you can avoid this by avoiding `.then()` syntax and using `async` / `await` instead. However, under the hood, the JavaScript runtime automatically compiles `await` statements down into implicit `Promise.prototype.then` chains. This means `async` / `await` is equally vulnerable.
   2. It bypasses direct scanners: Security tools scanning the application code will look at your functions handling sensitive user data with `then()` and see no flaws. The vulnerability is entirely "decoupled"—the security gap exists wherever user input is parsed incorrectly (e.g., an unsafe deep-clone library processing a JSON body), but the damage propagates to an entirely different part of the system. 

## How to defend against this
To prevent an attacker from modifying or hijacking your core language objects, you can explicitly freeze the core built-in prototypes right at the absolute entry point of your application (the top of `index.js`)

```javascript
// Secure the environment immediately upon application boot
Object.freeze(Object.prototype);
Object.freeze(Promise.prototype);
Object.freeze(Array.prototype);
```

Once `Object.freeze(Promise.prototype)` executes, any subsequent attempt by an attacker to alter or overwrite .then will throw an error or fail silently, rendering the pollution attack useless.

------------------------------


[1] [https://www.youtube.com](https://www.youtube.com/watch?v=XSgNXcJUr2Y&t=389)
[2] [https://portswigger.net](https://portswigger.net/web-security/prototype-pollution)
[3] [https://www.imperva.com](https://www.imperva.com/learn/application-security/prototype-pollution/)
[4] [https://www.youtube.com](https://www.youtube.com/watch?v=5ja_NVVg4Yc&t=400)
[5] [https://medium.com](https://medium.com/@appsecwarrior/prototype-pollution-a-javascript-vulnerability-c136f801f9e1)
[6] [https://www.cobalt.io](https://www.cobalt.io/blog/a-pentesters-guide-to-prototype-pollution-attacks)
[7] [https://blog.vidocsecurity.com](https://blog.vidocsecurity.com/blog/beginners-guide-to-understanding-client-prototype-pollution)

