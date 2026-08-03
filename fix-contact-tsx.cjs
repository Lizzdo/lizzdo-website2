const fs = require('fs');
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

// Replace {pageData?.emails?.map((email: string) => (...))} with single email and handle phone
const regexEmails = /\{pageData\?\.emails\?\.map\(\(email: string\) => \([\s\S]*?\}\)\)\}/g;
const replacementEmails = `{pageData?.email && (
                          <button 
                            onClick={() => handleCopyEmail(pageData.email)}
                            className="flex items-center gap-2 hover:text-white transition-colors text-left"
                          >
                            <span>{pageData.email}</span>
                            <Copy size={12} className={copiedEmail === pageData.email ? "text-neon-green" : "text-gray-600"} />
                            {copiedEmail === pageData.email && <span className="text-[9px] text-neon-green font-mono uppercase">Copied!</span>}
                          </button>
                        )}`;
content = content.replace(regexEmails, replacementEmails);

// Add WhatsApp to phone section
const regexPhone = /\{pageData\?\.phone\?\.split\('\\n'\)\.map\(\(line: string, i: number\) => <React\.Fragment key=\{i\}>\{line\}<br\/><\/React\.Fragment>\)\}/g;
const replacementPhone = `{pageData?.phone?.split('\\n').map((line: string, i: number) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        {pageData?.whatsapp && (
                          <span className="block mt-2 text-neon-green/80">WhatsApp: {pageData.whatsapp}</span>
                        )}`;
content = content.replace(regexPhone, replacementPhone);

// Update map
const regexMap = /<iframe[\s\S]*?src="https:\/\/www\.google\.com\/maps\/embed\?pb=!1m18[\s\S]*?<\/iframe>/;
const replacementMap = `<iframe 
                    src={pageData?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x38d917b90f0e79cf%3A0xa816b2637f8ce5da!2sPeshawar%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1714154425439!5m2!1sen!2s"} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>`;
content = content.replace(regexMap, replacementMap);

// Replace form title
const regexFormTitle = /<h3 className="font-display text-3xl font-bold mb-4">LET'S BUILD SOMETHING<\/h3>/;
const replacementFormTitle = `<h3 className="font-display text-3xl font-bold mb-4">{pageData?.formTitle || "LET'S BUILD SOMETHING"}</h3>`;
content = content.replace(regexFormTitle, replacementFormTitle);

// Replace form description
const regexFormDesc = /<p className="text-gray-400 font-future text-sm leading-relaxed">[\s\S]*?Whether you need a full game developed[\s\S]*?<\/p>/;
const replacementFormDesc = `<p className="text-gray-400 font-future text-sm leading-relaxed">
                  {pageData?.formDescription || "Whether you need a full game developed, a website built, or 3D assets created, our team is ready to help you achieve your goals."}
                </p>`;
content = content.replace(regexFormDesc, replacementFormDesc);

fs.writeFileSync('src/pages/Contact.tsx', content);
console.log("Updated Contact.tsx logic");
