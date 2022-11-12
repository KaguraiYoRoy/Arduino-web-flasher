import React, { useState, useRef } from "react";
import AvrgirlArduino from "avrgirl-arduino";

function App() {
  const boardChoices = [{ name: "Arduino nano", value: "nano" }];


  const fileInput = useRef(null);
  const [board, updateBoard] = useState(boardChoices[0]);
  const [fileName, updateFileName] = useState("");
  const [uploadStatus, updateUploadStatus] = useState("");
  const [uploadStatusTitle, updateUploadStatusTitle] = useState("");
  const [uploadStatusMsg, updateUploadStatusMsg] = useState("");




  const handleSubmit = e => {
    e.preventDefault();
    updateUploadStatus("flashing");
    updateUploadStatusTitle("Flashing Arduino...");


    const reader = new FileReader();
    console.log(fileInput.current.files[0])
    reader.readAsArrayBuffer(fileInput.current.files[0]);

    reader.onload = event => {
      const filecontents = event.target.result;

      const avrgirl = new AvrgirlArduino({
        board: board.value,
        debug: true
      });

      avrgirl.flash(filecontents, error => {
        if (error) {
          console.log(error.message);
          console.log(typeof error)
          updateUploadStatus("error");
          updateUploadStatusTitle("Error Flashing Arduino!");
          updateUploadStatusMsg(error.message)

        } else {
          console.info("flash successful");
          updateUploadStatus("done");
          updateUploadStatusTitle("Flash Sucessful!");
          updateUploadStatusMsg("Successfully flashed the Arduino!");
        }
      });
    };
  };

  const clearStatus = () => {
    updateUploadStatus("");
    updateUploadStatusTitle("");
    updateUploadStatusMsg("")
  }

  const BoardOptions = boardChoices.map((board, i) => <option value={board.value} key={i}>{board.name}</option>)

  return (
    <div className="w-full h-screen bg-gray-900">
      {uploadStatus && <div className="w-screen h-screen bg-opacity-90 fixed bg-gray-900 z-20 flex flex-col justify-center items-center">
        {uploadStatus === 'flashing' && <span className="loader"></span>}
        {uploadStatus === 'done' && <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-14 h-14 text-green-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        </span>}
        <h2 className="text-white text-2xl mt-6">{uploadStatusTitle}</h2>
        <p className="text-white mt-2">{uploadStatusMsg}</p>
        {uploadStatusMsg && <button className="bg-cyan-500 py-1.5 px-4 hover:bg-cyan-600 rounded-md text-white mt-6" onClick={clearStatus}>Close</button>}
      </div>}
      <form id="uploadForm" onSubmit={handleSubmit} className="flex flex-col w-4/5 sm:md-2/3 md:w-1/3 lg:w-1/4 m-auto h-full justify-center items-center gap-4">
        <h1 className="text-center text-white text-4xl mb-12 ">Arduino Web Flasher</h1>
        <div className="flex justify-center items-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Only .hex or .bin files</p>
            </div>
            <input id="dropzone-file"
              ref={fileInput}
              type="file"
              className="hidden"
              onChange={() =>
                updateFileName(fileInput.current.files[0].name)
              }
              onClick={() => fileInput.current.click()}
            />
          </label>
        </div>
        <div className="w-2/3">
          <label htmlFor="board-select" className="block mb-2 mt-8 text-sm font-medium text-gray-900 dark:text-gray-400">Select an option</label>
          <select
            id="boardType"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={board}
            onChange={event => updateBoard(event.target.value)}
          >
            {BoardOptions}
          </select>
        </div>
        <button type="submit" className="mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Upload to Arduino
          </span>
        </button>
      </form>
    </div>
  );
}

export default App;
