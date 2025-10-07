export const metadata = {
  title: "ADHDer",
  description: "ADHD-friendly focus and daily companion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {process.env.CLARITY_PROJECT_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.CLARITY_PROJECT_ID}");
            `,
            }}
          />
        ) : null}
      </head>
      <body style={{ fontFamily: "-apple-system, system-ui, Roboto, sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}


