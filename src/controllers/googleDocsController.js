const { google } = require("googleapis");
const path = require("path");
// const fs = require("fs");

// Assuming your key file is named 'service-account-key.json' and stored in a 'config' folder
const keyFilePath = path.join(
  __dirname,
  "..",
  "configs",
  "service-account-key.json"
);

// const keyFile = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath, // Use keyFile instead of keyFilePath
  scopes: ["https://www.googleapis.com/auth/documents"],
});

const docs = google.docs({ version: "v1", auth });

async function exportToGdocs(req, res) {
  const { title, content } = req.body;

  try {
    // Get the authenticated client
    const client = await auth.getClient();

    // Create a new document
    const createResponse = await docs.documents.create({
      auth: client,
      requestBody: {
        title: title,
      },
    });

    const documentId = createResponse.data.documentId;
    console.log("Document ID:", documentId);
    // Insert content into the document
    await docs.documents.batchUpdate({
      auth: client,
      documentId: documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content,
            },
          },
        ],
      },
    });

    const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log("Document URL:", docUrl);
    res.json({ docUrl });
  } catch (error) {
    console.error("Error creating Google Doc:", error);
    res
      .status(500)
      .json({ error: "Error creating Google Doc", details: error.message });
  }
}

module.exports = {
  exportToGdocs,
};

