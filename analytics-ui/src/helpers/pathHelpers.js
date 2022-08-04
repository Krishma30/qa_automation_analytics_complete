const CSV_PATH = `${process.env.REACT_APP_TESTING_S3_BUCKET}/results/`;

export function getCSVResultsPath(filename, sessionId) {
  return `${CSV_PATH}${sessionId}/${filename}`;
}
