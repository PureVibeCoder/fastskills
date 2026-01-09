/**
 * Pure JavaScript TF-IDF Search Engine
 * No external dependencies, compatible with Cloudflare Workers
 */

export interface TfIdfDocument {
  id: string;
  terms: Map<string, number>; // term -> term frequency
  length: number; // total terms count
}

export interface TfIdfSearchResult {
  id: string;
  score: number;
}

export class TfIdfEngine {
  private documents: Map<string, TfIdfDocument> = new Map();
  private documentFrequency: Map<string, number> = new Map(); // term -> doc count
  private totalDocuments: number = 0;

  /**
   * Tokenize text into terms
   * Handles both English and Chinese text
   */
  private tokenize(text: string): string[] {
    const normalized = text.toLowerCase();

    // Split on whitespace and punctuation, keep Chinese characters together
    const tokens: string[] = [];

    // English words
    const englishWords = normalized.match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) || [];
    tokens.push(...englishWords);

    // Chinese characters (each character as a token, plus bigrams)
    const chineseChars = normalized.match(/[\u4e00-\u9fa5]/g) || [];
    tokens.push(...chineseChars);

    // Chinese bigrams for better matching
    for (let i = 0; i < chineseChars.length - 1; i++) {
      tokens.push(chineseChars[i] + chineseChars[i + 1]);
    }

    return tokens.filter(t => t.length > 0);
  }

  /**
   * Calculate term frequency for a document
   */
  private calculateTermFrequency(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }
    // Normalize by document length
    const length = tokens.length;
    for (const [term, count] of tf) {
      tf.set(term, count / length);
    }
    return tf;
  }

  /**
   * Add a document to the index
   */
  addDocument(id: string, text: string): void {
    const tokens = this.tokenize(text);
    const tf = this.calculateTermFrequency(tokens);

    // Update document frequency for new terms
    const seenTerms = new Set<string>();
    for (const term of tokens) {
      if (!seenTerms.has(term)) {
        this.documentFrequency.set(term, (this.documentFrequency.get(term) || 0) + 1);
        seenTerms.add(term);
      }
    }

    this.documents.set(id, {
      id,
      terms: tf,
      length: tokens.length
    });

    this.totalDocuments++;
  }

  /**
   * Calculate IDF for a term
   */
  private calculateIdf(term: string): number {
    const df = this.documentFrequency.get(term) || 0;
    if (df === 0) return 0;
    return Math.log((this.totalDocuments + 1) / (df + 1)) + 1;
  }

  /**
   * Search for documents matching the query
   */
  search(query: string, limit: number = 5): TfIdfSearchResult[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const queryTf = this.calculateTermFrequency(queryTokens);
    const results: TfIdfSearchResult[] = [];

    for (const [docId, doc] of this.documents) {
      let score = 0;

      for (const [term, queryWeight] of queryTf) {
        const docWeight = doc.terms.get(term) || 0;
        if (docWeight > 0) {
          const idf = this.calculateIdf(term);
          score += queryWeight * docWeight * idf * idf;
        }
      }

      if (score > 0) {
        results.push({ id: docId, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get TF-IDF score for a specific document against a query
   */
  getScore(docId: string, query: string): number {
    const doc = this.documents.get(docId);
    if (!doc) return 0;

    const queryTokens = this.tokenize(query);
    const queryTf = this.calculateTermFrequency(queryTokens);

    let score = 0;
    for (const [term, queryWeight] of queryTf) {
      const docWeight = doc.terms.get(term) || 0;
      if (docWeight > 0) {
        const idf = this.calculateIdf(term);
        score += queryWeight * docWeight * idf * idf;
      }
    }

    return score;
  }

  /**
   * Clear all documents from the index
   */
  clear(): void {
    this.documents.clear();
    this.documentFrequency.clear();
    this.totalDocuments = 0;
  }

  /**
   * Get the number of indexed documents
   */
  size(): number {
    return this.totalDocuments;
  }
}
