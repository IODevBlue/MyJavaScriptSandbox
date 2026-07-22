function main() {
     const project = {
          name: "Resilient Chain Protocol",
          version: "1.0.0",
          isActive: true
     };

     // 2 represents the number of spaces for indentation
     const jsonString = JSON.stringify(project, null, 2);

     console.log(jsonString);
     /* Output:
          {
          "name": "Resilient Chain Protocol",
          "version": "1.0.0",
          "isActive": true
          }
     */
}

module.exports = { main };
