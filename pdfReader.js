// Import required modules
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');

// Function to extract text using pdf-parse (for text-based PDFs)
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text || "No text content found in this PDF.";
    } catch (error) {
        throw new Error("Error extracting text from PDF: " + error.message);
    }
}

// Function to extract text from images using Tesseract.js (OCR)
async function extractTextWithOCR(filePath) {
    const worker = createWorker();
    try {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(filePath);
        await worker.terminate();
        return text || "No text content found in the image.";
    } catch (error) {
        throw new Error("Error extracting text with OCR: " + error.message);
    }
}

// Function to determine the PDF type and extract text
async function readPDF(filePath) {
    console.log(`Processing file: ${filePath}\n`);

    try {
        // Try to extract text using pdf-parse
        const extractedText = await extractTextFromPDF(filePath);
        console.log("Extracted Text from PDF:\n", extractedText);
    } catch (pdfError) {
        console.warn("PDF parsing failed. Attempting OCR...\n");

        try {
            // If pdf-parse fails, fallback to OCR
            const ocrText = await extractTextWithOCR(filePath);
            console.log("Extracted Text from OCR:\n", ocrText);
        } catch (ocrError) {
            console.error("Both PDF parsing and OCR failed:", ocrError.message);
        }
    }
}

// Replace with the path to your PDF file
const filePath = './sample-1.pdf'; // Specify the file path
readPDF(filePath);
