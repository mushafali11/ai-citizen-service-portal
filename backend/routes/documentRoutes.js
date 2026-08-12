const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdf = require("pdf-parse");

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Common words that should not affect sentence importance
const stopWords = new Set([
  "the",
  "is",
  "in",
  "and",
  "to",
  "of",
  "a",
  "for",
  "on",
  "with",
  "that",
  "this",
  "it",
  "as",
  "are",
  "was",
  "be",
  "by",
  "or",
  "an",
  "at",
  "from",
  "which",
  "can",
  "will",
  "has",
  "have",
  "had",
  "not",
  "but",
  "we",
  "you",
  "they",
  "their",
  "its",
  "into",
  "about",
  "than",
  "then",
  "also",
  "such",
  "these",
  "those",
  "there",
  "here",
  "when",
  "where",
  "who",
  "what",
  "why",
  "how",
  "all",
  "any",
  "each",
  "other",
  "more",
  "most",
  "some",
]);

// Split text into manageable chunks
function splitIntoChunks(text, maxChunkSize = 6000) {
  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();

    if (!cleanSentence) continue;

    if (
      currentChunk.length + cleanSentence.length >
      maxChunkSize
    ) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      currentChunk = cleanSentence;
    } else {
      currentChunk +=
        (currentChunk ? " " : "") + cleanSentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Get important words and their frequencies
function getWordFrequency(text) {
  const frequency = {};

  const words =
    text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

  for (const word of words) {
    if (!stopWords.has(word)) {
      frequency[word] =
        (frequency[word] || 0) + 1;
    }
  }

  return frequency;
}

// Calculate similarity between two sentences
function calculateSimilarity(sentenceA, sentenceB) {
  const wordsA = new Set(
    (sentenceA.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])
      .filter((word) => !stopWords.has(word))
  );

  const wordsB = new Set(
    (sentenceB.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])
      .filter((word) => !stopWords.has(word))
  );

  if (!wordsA.size || !wordsB.size) {
    return 0;
  }

  let commonWords = 0;

  for (const word of wordsA) {
    if (wordsB.has(word)) {
      commonWords++;
    }
  }

  return commonWords / Math.min(wordsA.size, wordsB.size);
}

// Score and summarize a chunk
function summarizeChunk(chunk) {
  const sentences =
    chunk.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  const frequency = getWordFrequency(chunk);

  const scoredSentences = sentences
    .map((sentence, index) => {
      const cleanSentence = sentence.trim();

      const words =
        cleanSentence
          .toLowerCase()
          .match(/\b[a-z]{3,}\b/g) || [];

      // Ignore very short sentences
      if (words.length < 5) {
        return null;
      }

      let score = 0;

      for (const word of words) {
        if (!stopWords.has(word)) {
          score += frequency[word] || 0;
        }
      }

      // Normalize score so extremely long sentences
      // don't automatically dominate
      score = score / Math.sqrt(words.length);

      return {
        sentence: cleanSentence,
        score,
        index,
      };
    })
    .filter(Boolean);

  if (scoredSentences.length <= 3) {
    return scoredSentences;
  }

  // Select approximately 20% of sentences from each chunk
  const summarySize = Math.min(
    Math.max(3, Math.ceil(scoredSentences.length * 0.2)),
    8
  );

  // Sort by importance
  const sortedByScore = [...scoredSentences].sort(
    (a, b) => b.score - a.score
  );

  const selected = [];

  for (const candidate of sortedByScore) {
    // Stop when enough important sentences are selected
    if (selected.length >= summarySize) {
      break;
    }

    // Avoid very similar/repeated sentences
    const isTooSimilar = selected.some(
      (selectedSentence) =>
        calculateSimilarity(
          candidate.sentence,
          selectedSentence.sentence
        ) > 0.7
    );

    if (!isTooSimilar) {
      selected.push(candidate);
    }
  }

  // Restore original document order
  return selected.sort(
    (a, b) => a.index - b.index
  );
}

// Create final summary
function generateFinalSummary(chunkSummaries) {
  const allSentences = chunkSummaries.flat();

  // Remove similar sentences across different chunks
  const uniqueSentences = [];

  for (const candidate of allSentences) {
    const isTooSimilar = uniqueSentences.some(
      (selectedSentence) =>
        calculateSimilarity(
          candidate.sentence,
          selectedSentence.sentence
        ) > 0.75
    );

    if (!isTooSimilar) {
      uniqueSentences.push(candidate);
    }
  }

  // Final number of sentences
  const finalSize = Math.min(
    Math.max(5, Math.ceil(uniqueSentences.length * 0.6)),
    15
  );

  /*
    Re-score all selected sentences globally.
    This helps select the most important content
    from the entire document.
  */
  const globalText = uniqueSentences
    .map((item) => item.sentence)
    .join(" ");

  const globalFrequency =
    getWordFrequency(globalText);

  const rescored = uniqueSentences.map((item) => {
    const words =
      item.sentence
        .toLowerCase()
        .match(/\b[a-z]{3,}\b/g) || [];

    let score = 0;

    for (const word of words) {
      if (!stopWords.has(word)) {
        score += globalFrequency[word] || 0;
      }
    }

    score = score / Math.sqrt(words.length || 1);

    return {
      ...item,
      score,
    };
  });

  // Select final important sentences
  return rescored
    .sort((a, b) => b.score - a.score)
    .slice(0, finalSize)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence)
    .join(" ");
}

// UPLOAD PDF AND GENERATE SUMMARY
router.post(
  "/summarize",
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a PDF document",
        });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed",
        });
      }

      // Extract text from PDF
      const pdfData = await pdf(req.file.buffer);

      const text = pdfData.text
        .replace(/\s+/g, " ")
        .trim();

      if (!text) {
        return res.status(400).json({
          message:
            "Could not extract readable text from this PDF",
        });
      }

      // Split document into manageable chunks
      const chunks = splitIntoChunks(text);

      console.log(
        `Document split into ${chunks.length} chunks`
      );

      // Summarize each chunk
      const chunkSummaries = chunks.map((chunk) =>
        summarizeChunk(chunk)
      );

      // Generate final summary
      const finalSummary =
        generateFinalSummary(chunkSummaries);

      res.status(200).json({
        message:
          "Document summarized successfully",
        originalLength: text.length,
        totalChunks: chunks.length,
        summary: finalSummary,
      });
    } catch (error) {
      console.error(
        "Document summarization error:",
        error
      );

      res.status(500).json({
        message: "Error processing document",
        error: error.message,
      });
    }
  }
);

module.exports = router;