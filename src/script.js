let inputText="";
let encodedBytes=null;
let decodedText="";

const inputFile=document.querySelector("#inputFile");
const message=document.querySelector(".messageBlock");
const encodeButton=document.querySelector("#encodeButton");
const decodeButton=document.querySelector("#decodeButton");
const downloadBtn=document.querySelector("#downloadBtn");

inputFile.addEventListener("change", (event)=>{
    const file=event.target.files[0];
    if(!file){
        return;
    }
    const reader=new FileReader();
    if(file.name.endsWith(".txt")){
        reader.onload=(evt)=>{
            inputText=evt.target.result;
            message.innerText="Text file is uploaded, Click on Encode Button";
        }
        reader.readAsText(file);
    }
    else if(file.name.endsWith(".huff")){
        reader.onload=(evt)=>{
            encodedBytes=new Uint8Array(evt.target.result);
            message.innerText="Encoded file is uploaded, Click on Decode Button";
        }
        reader.readAsArrayBuffer(file);
    }
    else{
        alert("Invalid file type");
        message.innerText="Please upload a valid .txt/.huff file";
    }
});
encodeButton.addEventListener("click", ()=>{
    if(!inputText){
        alert("Text file is not uploaded");
        message.innerText="Please enter a valid .txt file to encode";
        return;
    }
    encodedBytes=huffmanEncode(inputText);
    message.innerText="Encoding Completed! Click DOWNLOAD to download the encoded file";
});
decodeButton.addEventListener("click", ()=>{
    if(!encodedBytes){
        alert("Encoded file is not uploaded");
        message.innerText="Please enter a valid .huff file to decode";
        return;
    }
    decodedText=huffmanDecode(encodedBytes);
    message.innerText="Decoding Completed! Click DOWNLOAD to download the decoded file";
});
downloadBtn.addEventListener("click", ()=>{
    const inputFileName=inputFile.files[0].name.split('.')[0];
    if(inputText && encodedBytes){
        downloadFile(encodedBytes, `${inputFileName}_encoded.huff`);
    }
    else if(encodedBytes && decodedText){
        downloadFile(decodedText, `${inputFileName}_decoded.txt`);
    }
    else{
        alert("Nothing to download");
        message.innerText="Please upload a valid .txt/.huff file and click on Encode/Decode";
    }
});
function downloadFile(data, fileName){
    let blob;
    if(typeof data==="string"){
        blob=new Blob([data], {type: "text/plain"});
    }
    else{
        blob=new Blob([data], {type: "application/octet-stream"});
    }
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}