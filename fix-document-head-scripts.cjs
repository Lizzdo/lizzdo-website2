const fs = require('fs');
let content = fs.readFileSync('src/components/DocumentHead.tsx', 'utf8');

const regexReturn = /return \(\s*<Helmet>/;
const replacementReturn = `return (
    <Helmet>
      {globalData?.ga_id && (
        <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${globalData.ga_id}\`}></script>
      )}
      {globalData?.ga_id && (
        <script>
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '\${globalData.ga_id}');
          \`}
        </script>
      )}
      {globalData?.gtm_id && (
        <script>
          {\`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','\${globalData.gtm_id}');
          \`}
        </script>
      )}
`;

content = content.replace(regexReturn, replacementReturn);

fs.writeFileSync('src/components/DocumentHead.tsx', content);
console.log("Updated DocumentHead.tsx with GA/GTM");
