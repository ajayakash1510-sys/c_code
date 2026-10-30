import { CodeLine, SyntaxToken } from '../types';

export function tokenizeCCode(codeString: string): CodeLine[] {
  const rawLines = codeString.split('\n');

  return rawLines.map((lineText, index) => {
    return {
      lineNumber: index + 1,
      text: lineText,
      tokens: tokenizeSingleLine(lineText),
    };
  });
}

function tokenizeSingleLine(line: string): SyntaxToken[] {
  if (line.trim() === '') {
    return [{ text: line || ' ', type: 'default' }];
  }

  const tokens: SyntaxToken[] = [];
  let i = 0;

  // Check for line comment first
  const commentIndex = line.indexOf('//');
  let lineContent = line;
  let commentContent = '';
  if (commentIndex !== -1) {
    lineContent = line.substring(0, commentIndex);
    commentContent = line.substring(commentIndex);
  }

  // Preprocessor check
  const trimmed = lineContent.trim();
  if (trimmed.startsWith('#')) {
    tokens.push({ text: lineContent, type: 'preprocessor' });
    if (commentContent) {
      tokens.push({ text: commentContent, type: 'comment' });
    }
    return tokens;
  }

  const keywords = new Set([
    'if', 'else', 'switch', 'case', 'break', 'default', 'return',
    'while', 'for', 'do', 'continue', 'struct', 'sizeof', 'goto'
  ]);

  const types = new Set([
    'int', 'char', 'float', 'double', 'void', 'long', 'short',
    'unsigned', 'signed', 'const'
  ]);

  const functions = new Set([
    'printf', 'scanf', 'main', 'puts', 'putchar', 'getchar'
  ]);

  while (i < lineContent.length) {
    const char = lineContent[i];

    // Whitespace
    if (/\s/.test(char)) {
      let space = '';
      while (i < lineContent.length && /\s/.test(lineContent[i])) {
        space += lineContent[i];
        i++;
      }
      tokens.push({ text: space, type: 'default' });
      continue;
    }

    // String literals
    if (char === '"') {
      let str = '"';
      i++;
      while (i < lineContent.length && lineContent[i] !== '"') {
        if (lineContent[i] === '\\' && i + 1 < lineContent.length) {
          str += lineContent[i] + lineContent[i + 1];
          i += 2;
        } else {
          str += lineContent[i];
          i++;
        }
      }
      if (i < lineContent.length && lineContent[i] === '"') {
        str += '"';
        i++;
      }
      tokens.push({ text: str, type: 'string' });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(char)) {
      let num = '';
      while (i < lineContent.length && /[0-9.]/.test(lineContent[i])) {
        num += lineContent[i];
        i++;
      }
      tokens.push({ text: num, type: 'number' });
      continue;
    }

    // Identifiers (keywords, types, functions, variables)
    if (/[a-zA-Z_]/.test(char)) {
      let word = '';
      while (i < lineContent.length && /[a-zA-Z0-9_]/.test(lineContent[i])) {
        word += lineContent[i];
        i++;
      }

      if (keywords.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (types.has(word)) {
        tokens.push({ text: word, type: 'type' });
      } else if (functions.has(word)) {
        tokens.push({ text: word, type: 'function' });
      } else {
        tokens.push({ text: word, type: 'variable' });
      }
      continue;
    }

    // Multi-char operators
    const next2 = lineContent.substr(i, 2);
    if (['>=', '<=', '==', '!=', '&&', '||', '++', '--'].includes(next2)) {
      tokens.push({ text: next2, type: 'operator' });
      i += 2;
      continue;
    }

    // Single-char operators and punctuation
    if (['+', '-', '*', '/', '%', '=', '<', '>', '!'].includes(char)) {
      tokens.push({ text: char, type: 'operator' });
      i++;
      continue;
    }

    if ([';', '{', '}', '(', ')', '[', ']', ',', ':'].includes(char)) {
      tokens.push({ text: char, type: char === ':' ? 'label' : 'punctuation' });
      i++;
      continue;
    }

    tokens.push({ text: char, type: 'default' });
    i++;
  }

  if (commentContent) {
    tokens.push({ text: commentContent, type: 'comment' });
  }

  return tokens;
}
