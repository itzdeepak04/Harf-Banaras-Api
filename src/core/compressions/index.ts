import compression from 'compression';

/**
 * Get compression middleware configuration
 */
export function getCompressionConfig() {
  return compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Compression level (0-9)
  });
}

export default compression;
