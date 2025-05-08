/** frontend/craco.config.js */
module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    webpack: {
      configure: (config) => {
        const oneOfRule = config.module.rules.find(r => Array.isArray(r.oneOf));
        if (!oneOfRule) return config;
        oneOfRule.oneOf.forEach(rule => {
          if (rule.loader && rule.loader.includes('babel-loader') && rule.exclude) {
            // транспилируем react-leaflet и leaflet
            rule.exclude = /node_modules\/(?!react-leaflet|leaflet)/;
          }
        });
        return config;
      },
    },
  };
  