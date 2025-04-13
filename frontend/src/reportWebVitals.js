const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

// installed npm i gh pages --save-dev
// added:
// "homepage": "https://(github username).github.io/(repo name)"
// "predeploy": "npm run build"
// "deploy": "gh-pages -d build"
// in package-json in frontend folder
