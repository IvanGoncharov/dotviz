const errorPatterns = [
  [/^Error: (.*)/, 'error'],
  [/^Warning: (.*)/, 'warning'],
];

export function parseStderrMessages(messages) {
  return messages.map((message) => {
    for (const [pattern, level] of errorPatterns) {
      let match;

      if ((match = pattern.exec(message)) !== null) {
        return { message: match[1].trimEnd(), level };
      }
    }

    return { message: message.trimEnd() };
  });
}

export function parseAgerrMessages(messages) {
  const result = [];
  let level;

  for (let i = 0; i < messages.length; i++) {
    if (messages[i] == 'Error' && messages[i + 1] == ': ') {
      level = 'error';
      i += 1;
    } else if (messages[i] == 'Warning' && messages[i + 1] == ': ') {
      level = 'warning';
      i += 1;
    } else {
      result.push({ message: messages[i].trimEnd(), level });
    }
  }

  return result;
}
