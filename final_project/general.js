const axios = require('axios');

async function getBooksAsync() {
    try {
        const response = await axios.get('https://dimrom76-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/Fairy tales');
        console.log("Books list (async/await):");
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
}

getBooksAsync();