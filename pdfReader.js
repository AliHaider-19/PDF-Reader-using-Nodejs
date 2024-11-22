const fs = require("fs");
const pdf = require("pdf-parse");

// Path to the CV/Resume PDF file
const pdfFilePath = "./Ali Haider Full Stack Developer.pdf";

// Function to parse student CV data
async function parseStudentCV(filePath) {
    try {
        // Read the PDF file
        const dataBuffer = fs.readFileSync(filePath);

        // Extract text from the PDF
        const pdfData = await pdf(dataBuffer);
        const text = pdfData.text;

        // Display raw text (optional)
        console.log("Raw PDF Text:");
        console.log(text);

        // Extract structured data using regex or heuristics
        const studentData = extractCVData(text);

        // Display structured data
        console.log("\nExtracted Student Data:");
        console.log(studentData);
    } catch (error) {
        console.error("Error reading the PDF file:", error.message);
    }
}

// Function to extract relevant sections from the CV text
function extractCVData(text) {
    const data = {};

    // Extract Name (assume name is the first large text or appears near "Name")
    data.name = extractUsingRegex(text, /(?:Name[:\s]+)?([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);

    // Extract Email
    data.email = extractUsingRegex(text, /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    // Extract Phone Number
    data.phone = extractUsingRegex(text, /(?:Phone[:\s]+)?(\+?\d[\d\s-]{8,})/);

    // Extract Education (keywords like "Education", "University", "Degree")
    data.education = extractUsingRegex(text, /(Education|Degree|University).+/i);

    // Extract Skills (keywords like "Skills", comma-separated)
    data.skills = extractUsingRegex(text, /(Skills[:\s]+)([\w\s,]+)/i);

    // Extract Experience (keywords like "Experience", "Work History")
    data.experience = extractUsingRegex(text, /(Experience|Work History).+/i);

    return data;
}

// Utility function to extract using regex
function extractUsingRegex(text, regex) {
    const match = text.match(regex);
    return match ? match[1].trim() : "Not Found";
}

// Parse the CV file
parseStudentCV(pdfFilePath);
