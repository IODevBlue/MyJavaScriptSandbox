// `onmessage` acts as the event hook waiting for input
onmessage = (event) => {
    const inputData = event.data.pay_load; // Extract the payload from the event data
    console.log("Received Payload: ", inputData)

    let result = `Processed: ${inputData}`; // Process the input data (this is a placeholder for actual processing logic)
    // Signify completion by posting the result back to the main thread
    postMessage(result); 
};