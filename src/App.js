import "./styles.css"; // https://cdnjs.com/libraries/tailwindcss
import TurndownService from "turndown";
// https://github.com/mixmark-io/turndown
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchangeAlt,
  faClipboard,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import showdown from "showdown";
const converter = new showdown.Converter();
const turndownService = new TurndownService();
console.clear();
const titleClass = `
  bg-gray-100
  border-b-0 border border-solid
  py-2
  px-2
  border-black
  m-0
  text-center
`;
const textAreaClass = `
  box-border
  resize-none
  border border-black 
  shadow-lg 
  h-full
  w-full
  p-3
`;

// https://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side
function saveTextAsFile(data, fileExtension) {
  const textFileAsBlob = new Blob([data], { type: "text/plain" });
  const fileNameToSaveAs = "file." + fileExtension; // filename.extension
  const downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = function destroyClickedElement(event) {
      // remove the link from the DOM
      document.body.removeChild(event.target);
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}

export default function App() {
  const [html, setHTML] = useState("");
  const [md, setMd] = useState("");
  const htmlSource = useRef();
  const mdSource = useRef();

  const handleHTMLChange = (e) => {
    const { value } = e.target;
    setHTML(value);
    try {
      const markdown = turndownService.turndown(value);
      setMd(markdown);
    } catch (e) {
      console.log(e);
    }
  };
  const handleMDChange = (e) => {
    const { value } = e.target;
    setMd(value);
    try {
      const html = converter.makeHtml(value);
      setHTML(html);
    } catch (e) {
      console.log(e);
    }
  };
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#using_execcommand
  function copy(source) {
    const copyText = source.current;
    console.log(copyText);
    copyText.select();
    document.execCommand("copy");
  }
  return (
    <div
      style={{ maxWidth: "960px" }}
      className="mx-auto h-screen flex flex-col min-h-full"
    >
      <h1 className="m-0 text-center p-2 text-lg uppercase">
        Mark Ups &amp; Downs
      </h1>
      <section className="h-1/2 flex items-center mx-4 mb-4">
        <div id="html-source" className="w-1/2 h-full flex-grow box-border">
          <p className={titleClass}>
            HTML (Source)
            <FontAwesomeIcon
              className="float-right cursor-pointer hover:text-black text-gray-400"
              icon={faClipboard}
              onClick={() => copy(htmlSource)}
            />
            <FontAwesomeIcon
              icon={faDownload}
              className="mr-2 float-right cursor-pointer hover:text-black text-gray-400"
              onClick={() => saveTextAsFile(html, "html")}
            />
          </p>
          <textarea
            ref={htmlSource}
            value={html}
            onChange={handleHTMLChange}
            className={textAreaClass}
          ></textarea>
          {/*  w-full  px-3 py-2 text-base text-gray-700 placeholder-gray-600 focus:shadow-outline */}
        </div>
        <div id="between" className="mx-4 text-lg text-center">
          <FontAwesomeIcon icon={faExchangeAlt} />
        </div>
        <div id="markdown-source" className="w-1/2 h-full flex-grow box-border">
          <p className={titleClass}>
            Markdown
            <FontAwesomeIcon
              className="float-right cursor-pointer hover:text-black text-gray-400"
              icon={faClipboard}
              onClick={() => copy(mdSource)}
            />
            <FontAwesomeIcon
              icon={faDownload}
              className="mr-2 float-right cursor-pointer hover:text-black text-gray-400"
              onClick={() => saveTextAsFile(md, "md")}
            />
          </p>
          <textarea
            ref={mdSource}
            value={md}
            onChange={handleMDChange}
            className={textAreaClass}
          ></textarea>
        </div>
      </section>
      {/* HTML OUTPUT */}
      <section
        style={{ height: "30%" }}
        className="mt-8 mx-4 flex flex-col items-center"
      >
        <p className="m-0 mb-2">HTML Output:</p>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="box-border h-full max-h-full overflow-auto bg-white border rounded-sm border-solid border-black shadow shadow-2xl shadow-black w-full p-5"
        ></div>
        {/* text-base text-gray-700  */}
      </section>
    </div>
  );
}
